import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-6 p-8 bg-white rounded-3xl border border-gray-100 shadow-xl">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-deep-violet/10 flex items-center justify-center text-deep-violet">
          <Compass className="w-10 h-10 animate-spin-slow text-deep-violet" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider">
            404 — Không tìm thấy trang
          </span>
          <h1 className="text-2xl font-bold font-serif text-dark-ink">
            Nội dung này không tồn tại
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Địa điểm, đơn vị hoặc đường dẫn bạn đang tìm kiếm có thể đã thay đổi
            hoặc chưa có trong cơ sở dữ liệu hướng dẫn du lịch Huế.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/kham-pha"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-deep-violet text-white text-sm font-semibold hover:bg-opacity-95 shadow-sm transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Khám phá điểm đến</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang chủ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
