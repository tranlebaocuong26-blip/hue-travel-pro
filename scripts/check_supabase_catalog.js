const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const client = new Client({
  connectionString: process.env.DIRECT_URL.replace(/"/g, ''),
  ssl: { rejectUnauthorized: false }
});

async function checkCatalog() {
  try {
    await client.connect();

    // 1. Roles attributes (rolsuper, rolbypassrls, etc.)
    const resRoles = await client.query(`
      SELECT rolname, rolcanlogin, rolsuper, rolbypassrls, rolcreaterole, rolcreatedb 
      FROM pg_roles 
      WHERE rolname IN ('postgres', 'anon', 'authenticated', 'service_role', 'authenticator', 'supabase_admin')
      ORDER BY rolname;
    `);
    console.log("=== ROLE ATTRIBUTES ===");
    console.log(JSON.stringify(resRoles.rows, null, 2));

    // 2. Default config for roles
    const resRoleConfig = await client.query(`
      SELECT rolname, rolconfig 
      FROM pg_roles 
      WHERE rolname IN ('postgres', 'authenticator', 'anon', 'authenticated');
    `);
    console.log("\n=== ROLE CONFIGS ===");
    console.log(JSON.stringify(resRoleConfig.rows, null, 2));

    // 3. Check PostgREST / exposed schemas via postgrest functions or settings
    const resPgrstSettings = await client.query(`
      SELECT name, setting 
      FROM pg_settings 
      WHERE name LIKE '%postgrest%' OR name LIKE '%pgrst%';
    `);
    console.log("\n=== POSTGREST SETTINGS IN PG_SETTINGS ===");
    console.log(JSON.stringify(resPgrstSettings.rows, null, 2));

    // 4. Check schemas metadata and default privileges
    const resSchemas = await client.query(`
      SELECT nspname, rolname AS owner, nspacl 
      FROM pg_namespace n
      JOIN pg_roles r ON n.nspowner = r.oid
      WHERE nspname IN ('public', 'internal', 'auth', 'storage', 'extensions')
      ORDER BY nspname;
    `);
    console.log("\n=== SCHEMAS METADATA ===");
    console.log(JSON.stringify(resSchemas.rows, null, 2));

    // 5. Check default privileges in schema public
    const resDefPrivs = await client.query(`
      SELECT 
        r.rolname AS grantor,
        n.nspname AS schema_name,
        defaclobjtype AS object_type,
        defaclacl AS default_acl
      FROM pg_default_acl d
      LEFT JOIN pg_namespace n ON d.defaclnamespace = n.oid
      JOIN pg_roles r ON d.defaclrole = r.oid;
    `);
    console.log("\n=== DEFAULT PRIVILEGES ===");
    console.log(JSON.stringify(resDefPrivs.rows, null, 2));

  } catch (err) {
    console.error("Error checking catalog:", err);
  } finally {
    await client.end();
  }
}

checkCatalog();
