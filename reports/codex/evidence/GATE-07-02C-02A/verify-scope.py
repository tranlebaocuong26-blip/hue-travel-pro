from pathlib import Path
import json,re
p=Path(r'A:\trí tuệ nhân tạo\BAI_3\hue-travel-pro')
e=p/'reports/codex/evidence/GATE-07-02C-02A'
a=(e/'luu-tru.before.tsx').read_text(encoding='utf-8-sig');b=(p/'src/app/luu-tru/page.tsx').read_text(encoding='utf-8-sig')
marker='      {/* Gợi ý theo nhu cầu Row';end='      {/* Main Grid + Right Sidebar'
i,j=a.index(marker),a.index(end);x,y=b.index(marker),b.index(end)
click=r'onClick=\{\(\) => \{[\s\S]*?\}\}'
result={'BeforeTargetUnchanged':a[:i]==b[:x],'AfterTargetUnchanged':a[j:]==b[y:],'ClickHandlersUnchanged':re.findall(click,a[i:j])==re.findall(click,b[x:y]),'ButtonCount':b[x:y].count('<button'),'ManualKeyboardHandlers':bool(re.search(r'onKey|tabIndex|role=',b[x:y]))}
(e/'protected-check.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
print(json.dumps(result))
