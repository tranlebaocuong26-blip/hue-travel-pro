export interface HeritageDetailItem {
  badge?: string;
  title: string;
  description: string;
}

export interface HeritageDetailSection {
  heading?: string;
  items: HeritageDetailItem[];
}

export interface HeritageTopicDetail {
  title: string;
  intro?: string;
  sections: HeritageDetailSection[];
}

export interface HeritageTopic {
  id: string;
  title: string;
  description: string;
  tag: string;
  markdownFile: string;
  detail: HeritageTopicDetail;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  sourceNote: string;
}

export const HERITAGE_TOPICS: HeritageTopic[] = [
  {
    id: "history",
    title: "Lịch sử hình thành",
    description: "Từ vùng đất Phú Xuân trù phú đến kinh đô của triều đại nhà Nguyễn trải dài hơn một thế kỷ.",
    tag: "Lịch sử",
    markdownFile: "01_lich_su_hinh_thanh.md",
    detail: {
      title: "Lịch sử hình thành và phát triển của Huế",
      intro: "Lịch sử hình thành và phát triển của Huế gắn liền với quá trình mở cõi về phương Nam của dân tộc Việt Nam, đặc biệt là giai đoạn hưng thịnh dưới thời các chúa Nguyễn và vương triều nhà Nguyễn.",
      sections: [
        {
          heading: "Các cột mốc lịch sử quan trọng:",
          items: [
            {
              badge: "Năm 1306",
              title: "Sáp nhập châu Ô, châu Lý",
              description: "Công chúa Huyền Trân (nhà Trần) kết hôn với vua Chăm Pa là Chế Mân. Chế Mân dâng hai châu Ô, Lý làm sính lễ. Năm 1307, vua Trần Anh Tông đổi tên thành châu Thuận và châu Hóa (gọi chung là Thuận Hóa).",
            },
            {
              badge: "Năm 1558",
              title: "Nguyễn Hoàng vào Nam",
              description: "Đoan Quận công Nguyễn Hoàng xin vào trấn thủ Thuận Hóa, đánh dấu cột mốc quan trọng trong việc xây dựng cơ đồ của các chúa Nguyễn ở Đàng Trong.",
            },
            {
              badge: "1636 – 1687",
              title: "Dời phủ chúa về Kim Long và Phú Xuân",
              description: "Năm 1636, chúa Nguyễn Phúc Lan dời phủ chúa về Kim Long. Đến năm 1687, chúa Nguyễn Phúc Thái lại dời phủ về Phú Xuân (vị trí trung tâm thành phố Huế ngày nay), biến nơi đây thành trung tâm chính trị, kinh tế và văn hóa sầm uất.",
            },
            {
              badge: "Năm 1788",
              title: "Kinh đô thời Tây Sơn",
              description: "Nguyễn Huệ lên ngôi hoàng đế (hiệu Quang Trung), tiếp tục chọn Phú Xuân làm kinh đô của vương triều Tây Sơn sau khi đánh bại quân chúa Nguyễn và họ Trịnh.",
            },
            {
              badge: "Năm 1802",
              title: "Kinh đô của nước Việt Nam thống nhất",
              description: "Nguyễn Ánh lên ngôi, lập ra nhà Nguyễn (hiệu Gia Long). Ông chọn Phú Xuân làm quốc đô, đổi tên thành Huế. Đây là giai đoạn Kinh thành Huế và các lăng tẩm quy mô lớn được xây dựng. Huế giữ vai trò thủ đô của Việt Nam cho đến năm 1945.",
            },
            {
              badge: "Tháng 8/1945",
              title: "Kết thúc chế độ phong kiến",
              description: "Hoàng đế Bảo Đại tuyên bố thoái vị và trao ấn kiếm cho chính quyền cách mạng tại Ngọ Môn, đánh dấu sự chấm dứt của triều Nguyễn cũng như chế độ quân chủ tại Việt Nam.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "culture",
    title: "Di sản văn hóa",
    description: "Quần thể di tích Cố đô, Nhã nhạc cung đình Huế và hệ thống mộc bản, châu bản vô giá.",
    tag: "Di sản",
    markdownFile: "02_di_san_van_hoa_unesco.md",
    detail: {
      title: "Các Di sản Văn hóa của Huế được UNESCO vinh danh",
      intro: "Tính đến nay, Huế tự hào là địa phương duy nhất tại Việt Nam sở hữu 8 di sản được Tổ chức Giáo dục, Khoa học và Văn hóa Liên Hợp Quốc (UNESCO) vinh danh. Các di sản này bao gồm 6 di sản thuộc về riêng Cố đô Huế và 2 di sản đồng sở hữu với các địa phương khác:",
      sections: [
        {
          heading: "6 Di sản thuộc riêng Thừa Thiên Huế:",
          items: [
            {
              badge: "1993",
              title: "Quần thể Di tích Cố đô Huế",
              description: "(Di sản Văn hóa thế giới - 1993): Bao gồm hệ thống các công trình kiến trúc cung đình triều Nguyễn như Hoàng Thành Huế, lăng tẩm các vua Nguyễn, đàn Nam Giao... Đây là di sản đầu tiên của Việt Nam được UNESCO ghi danh.",
            },
            {
              badge: "2003",
              title: "Nhã nhạc cung đình Huế",
              description: "(Di sản Văn hóa phi vật thể đại diện của nhân loại - 2003): Loại hình âm nhạc cung đình truyền thống đặc sắc, thường được biểu diễn trong các dịp lễ hội và triều hội thời phong kiến.",
            },
            {
              badge: "2009",
              title: "Mộc bản triều Nguyễn",
              description: "(Di sản tư liệu thuộc Chương trình Ký ức thế giới - 2009): Những bản gỗ khắc chữ Hán Nôm ngược dùng để in sách, lưu trữ tài liệu lịch sử, văn hóa, chính trị của triều đình.",
            },
            {
              badge: "2017",
              title: "Châu bản triều Nguyễn",
              description: "(Di sản tư liệu thuộc Chương trình Ký ức thế giới - 2017): Khối tài liệu hành chính của triều Nguyễn, nổi bật với bút tích phê duyệt trực tiếp của các vị hoàng đế bằng mực son.",
            },
            {
              badge: "2016",
              title: "Thơ văn trên kiến trúc cung đình Huế",
              description: "(Di sản tư liệu thuộc Chương trình Ký ức thế giới khu vực châu Á - Thái Bình Dương - 2016): Hệ thống các tác phẩm thi ca được chạm khắc, khảm cẩn, tráng men trên các công trình kiến trúc tại Hoàng cung và lăng tẩm.",
            },
            {
              badge: "2024",
              title: "Những bản đúc nổi trên Cửu Đỉnh ở Hoàng cung Huế",
              description: "(Di sản tư liệu thuộc Chương trình Ký ức thế giới khu vực châu Á - Thái Bình Dương - 2024): 162 họa tiết chạm khắc tinh xảo mang tính bách khoa thư về cảnh quan, sản vật và văn hóa Việt Nam trên 9 chiếc đỉnh đồng lớn.",
            },
          ],
        },
        {
          heading: "2 Di sản đồng sở hữu với các địa phương khác:",
          items: [
            {
              badge: "2016",
              title: "Thực hành tín ngưỡng thờ Mẫu Tam phủ của người Việt",
              description: "(Di sản Văn hóa phi vật thể đại diện của nhân loại - 2016): Tín ngưỡng nội sinh gắn liền với điện Hòn Chén ở Huế, một trong những trung tâm thờ Mẫu lớn nhất.",
            },
            {
              badge: "2017",
              title: "Nghệ thuật Bài Chòi Trung Bộ Việt Nam",
              description: "(Di sản Văn hóa phi vật thể đại diện của nhân loại - 2017): Loại hình nghệ thuật dân gian kết hợp giữa âm nhạc, thơ ca, diễn xướng, vô cùng phổ biến trong đời sống tinh thần của người dân Huế.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "modern",
    title: "Huế ngày nay",
    description: "Thành phố di sản văn hóa, sinh thái, cảnh quan; chính thức trở thành Thành phố trực thuộc Trung ương.",
    tag: "Phát triển",
    markdownFile: "03_hue_ngay_nay.md",
    detail: {
      title: "Huế ngày nay: Giao thoa giữa di sản và phát triển hiện đại",
      intro: "Huế ngày nay đang trong giai đoạn chuyển mình vươn lên mạnh mẽ với mục tiêu phát triển thành thành phố trực thuộc Trung ương, hướng tới sự cân bằng giữa việc bảo tồn di sản cổ kính và xây dựng một đô thị thông minh, năng động. Không gian đô thị đang được mở rộng chiến lược về hướng biển và đầm phá, đi kèm với hệ thống giao thông liên kết vùng được nâng cấp đồng bộ.",
      sections: [
        {
          heading: "Các trụ cột chuyển mình quan trọng:",
          items: [
            {
              badge: "01",
              title: "Đô thị di sản thông minh",
              description: "Bên cạnh vẻ đẹp trầm mặc truyền thống, Huế đang đẩy mạnh chuyển đổi số và ứng dụng công nghệ thông tin vào quản lý đô thị. Các dự án số hóa di sản và phát triển nền tảng đô thị thông minh đang tạo ra môi trường thực tiễn lý tưởng cho những người học tập và làm việc trong lĩnh vực công nghệ, phát triển phần mềm và lập trình.",
            },
            {
              badge: "02",
              title: "Trung tâm đào tạo nguồn nhân lực",
              description: "Hệ thống giáo dục của địa phương, từ Đại học Huế đến các trường cao đẳng công nghiệp và kỹ thuật, không ngừng cập nhật chương trình giảng dạy. Đặc biệt, các ngành đào tạo về công nghệ thông tin, kỹ thuật số được chú trọng đầu tư nhằm cung cấp nguồn nhân lực chất lượng cao phục vụ trực tiếp cho quá trình hiện đại hóa của khu vực miền Trung và cả nước.",
            },
            {
              badge: "03",
              title: "Nhịp sống đương đại",
              description: "Nhịp sống tại khu vực trung tâm cũng như các vùng ven đang dần trở nên hiện đại hóa với sự xuất hiện của hạ tầng viễn thông đồng bộ. Các không gian làm việc sáng tạo, quán cà phê hiện đại và dịch vụ giải trí phong phú mang lại một môi trường sống tiện nghi, năng động nhưng vẫn giữ trọn vẹn được chiều sâu và bản sắc văn hóa đặc trưng của vùng đất cố đô.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lifestyle",
    title: "Con người & nhịp sống",
    description: "Nét trầm tư, tinh tế trong giao tiếp, ẩm thực cung đình cầu kỳ kết hợp ẩm thực dân gian mộc mạc.",
    tag: "Đời sống",
    markdownFile: "04_con_nguoi_va_nhip_song.md",
    detail: {
      title: "Con người và nhịp sống Huế",
      intro: "Nét đặc trưng làm nên linh hồn của xứ Cố đô chính là chiều sâu tâm hồn con người cùng nhịp sống bình yên, thong dong nhưng luôn tràn đầy tinh thần khát vọng vươn lên.",
      sections: [
        {
          heading: "Nét đẹp xứ Huế:",
          items: [
            {
              badge: "Con người",
              title: "Con người xứ Huế",
              description: "Con người xứ Huế mang đậm nét tính cách trầm mặc, thanh lịch và vô cùng hiếu khách. Người dân nơi đây luôn dành sự trân trọng sâu sắc cho các giá trị văn hóa, truyền thống và nền tảng giáo dục. Kế thừa những đức tính đó, thế hệ thanh niên Huế ngày nay đang cho thấy sự chuyển mình đầy năng động. Họ nhạy bén với thời cuộc, đam mê tự học những kiến thức mới về công nghệ, lập trình và tích cực tham gia vào các câu lạc bộ thiện nguyện vì cộng đồng, tạo nên một thế hệ vừa giữ được nếp sống chuẩn mực, vừa vươn mình ra thế giới.",
            },
            {
              badge: "Nhịp sống",
              title: "Nhịp sống thường nhật",
              description: "Nhịp sống tại vùng đất Cố đô luôn giữ được sự thư thả, bình yên hiếm có so với sự hối hả của các đô thị lớn. Một ngày mới thường bắt đầu bằng nhịp điệu chậm rãi bên những ly cà phê thong dong. Tuy nhiên, đằng sau sự tĩnh lặng ấy là một guồng quay học tập và làm việc không ngừng nghỉ. Hình ảnh những người trẻ say sưa gõ phím, xây dựng các dự án ứng dụng hay miệt mài với các công việc từ xa trong những góc quán quen thuộc đã trở thành một phần tất yếu. Sự giao thoa tinh tế giữa nhịp sống chậm rãi, hoài niệm và tinh thần vươn lên nắm bắt công nghệ đã tạo nên một bức tranh đương đại đầy sức sống cho Huế.",
            },
          ],
        },
      ],
    },
  },
];

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    year: "Thế kỷ XVII",
    title: "Chúa Nguyễn & Phú Xuân",
    description: "Chúa Nguyễn Hoàng và các đời chúa kế nghiệp chọn vùng đất Phú Xuân làm trung tâm chính trị, văn hóa Đàng Trong.",
    sourceNote: "Đại Nam Thực Lục",
  },
  {
    year: "1802 – 1945",
    title: "Kinh đô Triều Nguyễn",
    description: "Vua Gia Long thống nhất đất nước, định đô tại Huế. Xây dựng Kinh thành, Đại Nội và hệ thống lăng tẩm hoàng gia quy mô bậc nhất.",
    sourceNote: "Trung tâm Bảo tồn Di tích Cố đô Huế",
  },
  {
    year: "1993",
    title: "Di sản Văn hóa Thế giới",
    description: "Quần thể Di tích Cố đô Huế được UNESCO công nhận là Di sản Văn hóa Thế giới đầu tiên của Việt Nam.",
    sourceNote: "UNESCO World Heritage Centre",
  },
  {
    year: "2025",
    title: "Thành phố trực thuộc TW",
    description: "Huế chính thức trở thành Thành phố trực thuộc Trung ương từ ngày 01/01/2025 theo Nghị quyết của Quốc hội.",
    sourceNote: "Cổng TTĐT Chính phủ / Nghị quyết Quốc hội",
  },
];
