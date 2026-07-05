import {
  Department,
  Team,
  Position,
  Competency,
  PositionCompetency,
  Employee,
  EvaluationPeriod,
  Evaluation,
  IDPItem,
  AIReport,
} from './types';

export const SEED_DEPARTMENTS: Department[] = [
  { id: 'dept-1', name: 'Phát Triển Kinh Doanh & Sản Phẩm', description: 'Khối Kinh doanh', teams: [] },
  { id: 'dept-2', name: 'Kỹ Thuật & Vận Hành', description: 'Khối Kỹ thuật', teams: [] },
  { id: 'dept-3', name: 'Phòng Nhân sự (HR)', description: 'Khối Quản trị Nhân sự - phụ trách tuyển dụng, đào tạo, C&B, quan hệ lao động và phát triển tổ chức', teams: [] },
];

export const SEED_TEAMS: Team[] = [
  { id: 'team-1', departmentId: 'dept-1', name: 'Phân tích kinh doanh & Báo cáo', description: '' },
  { id: 'team-2', departmentId: 'dept-1', name: 'Business Analytics', description: '' },
  { id: 'team-3', departmentId: 'dept-1', name: 'Product Owner & Design', description: '' },
  { id: 'team-4', departmentId: 'dept-1', name: 'R&D (Research & Development)', description: '' },
  { id: 'team-5', departmentId: 'dept-1', name: 'Project Management', description: '' },
  { id: 'team-6', departmentId: 'dept-2', name: 'Tech Spec & CTO', description: '' },
  { id: 'team-7', departmentId: 'dept-2', name: 'Phát triển Backend & Frontend', description: '' },
  { id: 'team-8', departmentId: 'dept-2', name: 'QC (Quality Control)', description: '' },
  { id: 'team-9', departmentId: 'dept-2', name: 'Operation Logistics', description: '' },
  // Phòng Nhân sự (dept-3)
  { id: 'team-10', departmentId: 'dept-3', name: 'Tuyển dụng (Talent Acquisition)', description: 'Phụ trách tìm kiếm, thu hút và tuyển chọn nhân tài' },
  { id: 'team-11', departmentId: 'dept-3', name: 'Đào tạo & Phát triển (L&D)', description: 'Xây dựng chương trình đào tạo, phát triển năng lực và lộ trình sự nghiệp' },
  { id: 'team-12', departmentId: 'dept-3', name: 'Chính sách & Phúc lợi (C&B)', description: 'Quản lý lương thưởng, phúc lợi, chính sách nhân sự và quan hệ lao động' },
];

export const SEED_POSITIONS: Position[] = [
  // dept-1
  { id: 'pos-1', teamId: 'team-1', departmentId: 'dept-1', name: 'Junior Business Analyst', level: 'Junior', description: '' },
  { id: 'pos-2', teamId: 'team-1', departmentId: 'dept-1', name: 'Senior Business Analyst', level: 'Senior', description: '' },
  { id: 'pos-3', teamId: 'team-1', departmentId: 'dept-1', name: 'BA Manager', level: 'Manager', description: '' },
  { id: 'pos-4', teamId: 'team-3', departmentId: 'dept-1', name: 'Junior Product Owner', level: 'Junior', description: '' },
  { id: 'pos-5', teamId: 'team-3', departmentId: 'dept-1', name: 'Senior Product Owner', level: 'Senior', description: '' },
  { id: 'pos-6', teamId: 'team-3', departmentId: 'dept-1', name: 'UI/UX Designer', level: 'Senior', description: '' },
  // dept-2
  { id: 'pos-7', teamId: 'team-7', departmentId: 'dept-2', name: 'Junior Backend Developer', level: 'Junior', description: '' },
  { id: 'pos-8', teamId: 'team-7', departmentId: 'dept-2', name: 'Senior Backend Developer', level: 'Senior', description: '' },
  { id: 'pos-9', teamId: 'team-7', departmentId: 'dept-2', name: 'Frontend Developer', level: 'Senior', description: '' },
  { id: 'pos-10', teamId: 'team-7', departmentId: 'dept-2', name: 'Technical Lead', level: 'Lead', description: '' },
  { id: 'pos-11', teamId: 'team-8', departmentId: 'dept-2', name: 'QC Tester', level: 'Junior', description: '' },
  { id: 'pos-12', teamId: 'team-8', departmentId: 'dept-2', name: 'QA Engineer', level: 'Senior', description: '' },
  // dept-3: Phòng Nhân sự
  // Tuyển dụng (team-10)
  { id: 'pos-13', teamId: 'team-10', departmentId: 'dept-3', name: 'Nhân viên Tuyển dụng (Recruiter)', level: 'Junior', description: 'Thực hiện quy trình tuyển dụng từ đăng tin đến phỏng vấn sơ bộ' },
  { id: 'pos-14', teamId: 'team-10', departmentId: 'dept-3', name: 'Chuyên viên Tuyển dụng (Senior Recruiter)', level: 'Senior', description: 'Tuyển dụng các vị trí khó, xây dựng thương hiệu nhà tuyển dụng' },
  { id: 'pos-15', teamId: 'team-10', departmentId: 'dept-3', name: 'Trưởng nhóm Tuyển dụng (TA Lead)', level: 'Lead', description: 'Quản lý đội ngũ tuyển dụng, lập kế hoạch nhân sự và chiến lược thu hút nhân tài' },
  // Đào tạo & Phát triển (team-11)
  { id: 'pos-16', teamId: 'team-11', departmentId: 'dept-3', name: 'Nhân viên Đào tạo (Training Coordinator)', level: 'Junior', description: 'Hỗ trợ tổ chức các khóa đào tạo nội bộ và theo dõi tiến độ học tập' },
  { id: 'pos-17', teamId: 'team-11', departmentId: 'dept-3', name: 'Chuyên viên Đào tạo & Phát triển (L&D Specialist)', level: 'Senior', description: 'Thiết kế chương trình đào tạo, xây dựng lộ trình phát triển năng lực' },
  { id: 'pos-18', teamId: 'team-11', departmentId: 'dept-3', name: 'Trưởng nhóm Đào tạo (L&D Manager)', level: 'Manager', description: 'Xây dựng chiến lược đào tạo toàn công ty, quản lý ngân sách L&D' },
  // Chính sách & Phúc lợi (team-12)
  { id: 'pos-19', teamId: 'team-12', departmentId: 'dept-3', name: 'Nhân viên C&B (C&B Executive)', level: 'Junior', description: 'Xử lý bảng lương, bảo hiểm xã hội, quản lý phép và hồ sơ nhân sự' },
  { id: 'pos-20', teamId: 'team-12', departmentId: 'dept-3', name: 'Chuyên viên C&B (C&B Specialist)', level: 'Senior', description: 'Xây dựng thang bảng lương, khảo sát thị trường, thiết kế gói phúc lợi' },
  { id: 'pos-21', teamId: 'team-12', departmentId: 'dept-3', name: 'Trưởng phòng Nhân sự (HR Manager)', level: 'Manager', description: 'Quản lý toàn bộ hoạt động nhân sự, quan hệ lao động, chiến lược HR' },
];

export const SEED_COMPETENCIES: Competency[] = [
  {
    id: 'comp-1', code: 'K01', name: 'Hiểu về chuyên môn nghiệp vụ', askGroup: 'knowledge', type: 'core',
    definition: 'Nắm vững các kiến thức chuyên môn cần thiết để thực hiện công việc hiệu quả.',
    observableBehaviors: ['Áp dụng kiến thức vào thực tế', 'Cập nhật kiến thức mới', 'Giải quyết vấn đề chuyên môn'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Hiểu các khái niệm cơ bản'] },
      { level: 2, description: 'Trung bình', behaviors: ['Áp dụng được vào công việc thường ngày dưới sự hướng dẫn'] },
      { level: 3, description: 'Khá', behaviors: ['Độc lập xử lý hầu hết công việc chuyên môn'] },
      { level: 4, description: 'Tốt', behaviors: ['Giải quyết các vấn đề phức tạp, hướng dẫn người khác'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Chuyên gia, đóng góp cải tiến quy trình'] }
    ],
    weight: 3, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-2', code: 'S01', name: 'Kỹ năng giao tiếp', askGroup: 'skill', type: 'core',
    definition: 'Khả năng truyền đạt và tiếp nhận thông tin hiệu quả qua lời nói và văn bản.',
    observableBehaviors: ['Trình bày rõ ràng', 'Lắng nghe tích cực', 'Giao tiếp phù hợp đối tượng'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Giao tiếp cơ bản trong nhóm'] },
      { level: 2, description: 'Trung bình', behaviors: ['Trình bày ý tưởng khá rõ ràng'] },
      { level: 3, description: 'Khá', behaviors: ['Giao tiếp hiệu quả liên phòng ban'] },
      { level: 4, description: 'Tốt', behaviors: ['Thuyết phục và đàm phán thành công'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Xử lý giao tiếp khủng hoảng, truyền cảm hứng'] }
    ],
    weight: 2, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-3', code: 'S05', name: 'Kỹ năng làm việc nhóm', askGroup: 'skill', type: 'core',
    definition: 'Khả năng phối hợp và hợp tác với những người khác để đạt được mục tiêu chung.',
    observableBehaviors: ['Hỗ trợ đồng nghiệp', 'Tôn trọng ý kiến khác biệt', 'Đóng góp tích cực vào công việc chung'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Tham gia vào các hoạt động nhóm'] },
      { level: 2, description: 'Trung bình', behaviors: ['Hoàn thành phần việc được giao trong nhóm'] },
      { level: 3, description: 'Khá', behaviors: ['Chủ động hỗ trợ các thành viên khác'] },
      { level: 4, description: 'Tốt', behaviors: ['Thúc đẩy sự hợp tác và giải quyết xung đột nhóm'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Xây dựng đội nhóm hiệu suất cao'] }
    ],
    weight: 2, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-4', code: 'A03', name: 'Tập trung vào kết quả', askGroup: 'attitude', type: 'core',
    definition: 'Luôn hướng tới mục tiêu và nỗ lực hoàn thành công việc đúng hạn, đạt chất lượng cao.',
    observableBehaviors: ['Cam kết với mục tiêu', 'Vượt qua trở ngại', 'Không viện lý do'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Hiểu mục tiêu công việc'] },
      { level: 2, description: 'Trung bình', behaviors: ['Thường xuyên hoàn thành công việc đúng hạn'] },
      { level: 3, description: 'Khá', behaviors: ['Nỗ lực đạt được kết quả tốt dù có khó khăn'] },
      { level: 4, description: 'Tốt', behaviors: ['Luôn vượt kỳ vọng về kết quả'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Tạo ra các đột phá về hiệu suất cho tổ chức'] }
    ],
    weight: 3, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  // Add some more competencies for variety
  {
    id: 'comp-5', code: 'K02', name: 'Trình độ ngoại ngữ', askGroup: 'knowledge', type: 'functional',
    definition: 'Khả năng sử dụng ngoại ngữ (chủ yếu là tiếng Anh) trong công việc.',
    observableBehaviors: ['Đọc hiểu tài liệu', 'Giao tiếp email', 'Giao tiếp trực tiếp'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Đọc hiểu từ vựng cơ bản'] },
      { level: 2, description: 'Trung bình', behaviors: ['Đọc hiểu tài liệu chuyên ngành, viết email đơn giản'] },
      { level: 3, description: 'Khá', behaviors: ['Giao tiếp trôi chảy, viết email chuyên nghiệp'] },
      { level: 4, description: 'Tốt', behaviors: ['Thuyết trình và đàm phán bằng ngoại ngữ'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Sử dụng ngoại ngữ như tiếng mẹ đẻ trong công việc'] }
    ],
    weight: 2, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-6', code: 'S09', name: 'Phân tích và ra quyết định', askGroup: 'skill', type: 'management',
    definition: 'Khả năng phân tích thông tin phức tạp và đưa ra quyết định kịp thời, chính xác.',
    observableBehaviors: ['Thu thập dữ liệu đầy đủ', 'Đánh giá các rủi ro', 'Quyết đoán'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Đưa ra quyết định trong các tình huống đơn giản'] },
      { level: 2, description: 'Trung bình', behaviors: ['Phân tích vấn đề dựa trên dữ liệu có sẵn'] },
      { level: 3, description: 'Khá', behaviors: ['Xử lý các tình huống phức tạp có nhiều biến số'] },
      { level: 4, description: 'Tốt', behaviors: ['Ra quyết định chiến lược có tầm ảnh hưởng lớn'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Dự đoán và ra quyết định đi trước xu hướng'] }
    ],
    weight: 3, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  // === Năng lực chuyên biệt cho HR ===
  {
    id: 'comp-7', code: 'S02', name: 'Kỹ năng đàm phán và thuyết phục', askGroup: 'skill', type: 'functional',
    definition: 'Khả năng thương lượng, đàm phán để đạt được thỏa thuận có lợi cho các bên. Đặc biệt quan trọng trong tuyển dụng, thương lượng offer và giải quyết tranh chấp lao động.',
    observableBehaviors: ['Đưa ra phương án win-win', 'Xử lý từ chối và phản đối hiệu quả', 'Giữ bình tĩnh trong thương lượng căng thẳng', 'Thuyết phục ứng viên/nhân viên thay đổi quan điểm'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Thương lượng trong tình huống đơn giản'] },
      { level: 2, description: 'Trung bình', behaviors: ['Đàm phán offer với ứng viên junior', 'Giải quyết bất đồng nhỏ'] },
      { level: 3, description: 'Khá', behaviors: ['Đàm phán các tình huống phức tạp', 'Thuyết phục quản lý thay đổi quyết định'] },
      { level: 4, description: 'Tốt', behaviors: ['Đàm phán với ứng viên cấp cao, đối tác headhunter', 'Xử lý tranh chấp lao động'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Thiết kế chiến lược đàm phán tổ chức', 'Là chuyên gia hòa giải nội bộ'] }
    ],
    weight: 2, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-8', code: 'S13', name: 'Kỹ năng đào tạo', askGroup: 'skill', type: 'functional',
    definition: 'Khả năng thiết kế, tổ chức và triển khai các chương trình đào tạo nội bộ nhằm nâng cao năng lực cho đội ngũ nhân viên.',
    observableBehaviors: ['Xác định nhu cầu đào tạo chính xác', 'Thiết kế nội dung phù hợp đối tượng', 'Truyền đạt kiến thức hiệu quả', 'Đánh giá kết quả sau đào tạo'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Hỗ trợ tổ chức lớp học, chuẩn bị tài liệu'] },
      { level: 2, description: 'Trung bình', behaviors: ['Tổ chức workshop nhỏ cho team', 'Hướng dẫn onboarding nhân viên mới'] },
      { level: 3, description: 'Khá', behaviors: ['Thiết kế chương trình đào tạo chuyên sâu', 'Đào tạo trực tiếp nhóm 10-20 người'] },
      { level: 4, description: 'Tốt', behaviors: ['Xây dựng hệ thống đào tạo toàn công ty', 'Đo lường ROI đào tạo'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Thiết kế chiến lược L&D dài hạn', 'Xây dựng văn hóa học tập tổ chức'] }
    ],
    weight: 2, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-9', code: 'S06', name: 'Kỹ năng quản trị mối quan hệ', askGroup: 'skill', type: 'functional',
    definition: 'Khả năng xây dựng, duy trì và phát triển mạng lưới quan hệ với các bên liên quan bao gồm nhân viên, quản lý, đối tác và ứng viên.',
    observableBehaviors: ['Xây dựng niềm tin và uy tín', 'Duy trì mối quan hệ lâu dài', 'Giải quyết mâu thuẫn giữa các bên', 'Kết nối đúng người đúng việc'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Giao tiếp lịch sự, tạo ấn tượng tốt ban đầu'] },
      { level: 2, description: 'Trung bình', behaviors: ['Duy trì quan hệ tốt với đồng nghiệp và ứng viên'] },
      { level: 3, description: 'Khá', behaviors: ['Xây dựng mạng lưới quan hệ rộng', 'Được tin tưởng bởi nhiều phòng ban'] },
      { level: 4, description: 'Tốt', behaviors: ['Quản trị quan hệ lao động phức tạp', 'Là cầu nối giữa ban lãnh đạo và nhân viên'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Xây dựng chiến lược quản trị nhân tài', 'Tạo dựng employer branding mạnh'] }
    ],
    weight: 2, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-10', code: 'A05', name: 'Trung thực và bảo mật', askGroup: 'attitude', type: 'core',
    definition: 'Luôn trung thực, minh bạch trong xử lý công việc. Bảo mật thông tin nhân sự, lương thưởng và các dữ liệu nhạy cảm của tổ chức.',
    observableBehaviors: ['Không tiết lộ thông tin lương', 'Xử lý hồ sơ nhân sự bảo mật', 'Báo cáo trung thực', 'Tuân thủ quy định GDPR/PDPA'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Hiểu quy định bảo mật cơ bản'] },
      { level: 2, description: 'Trung bình', behaviors: ['Tuân thủ nghiêm ngặt quy định bảo mật thông tin'] },
      { level: 3, description: 'Khá', behaviors: ['Chủ động phát hiện và ngăn chặn rủi ro bảo mật'] },
      { level: 4, description: 'Tốt', behaviors: ['Xây dựng quy trình bảo mật cho phòng HR', 'Đào tạo nhận thức bảo mật cho team'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Thiết lập hệ thống bảo mật thông tin nhân sự toàn diện'] }
    ],
    weight: 3, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  },
  {
    id: 'comp-11', code: 'S03', name: 'Kỹ năng tổ chức và quản lý thời gian', askGroup: 'skill', type: 'core',
    definition: 'Khả năng sắp xếp công việc, ưu tiên nhiệm vụ và quản lý thời gian hiệu quả để hoàn thành nhiều đầu việc song song.',
    observableBehaviors: ['Lập kế hoạch làm việc rõ ràng', 'Ưu tiên công việc đúng đắn', 'Hoàn thành đúng hạn', 'Xử lý đa nhiệm hiệu quả'],
    levelDescriptions: [
      { level: 1, description: 'Cơ bản', behaviors: ['Hoàn thành công việc được giao đúng hạn'] },
      { level: 2, description: 'Trung bình', behaviors: ['Tự lập kế hoạch công việc hàng tuần'] },
      { level: 3, description: 'Khá', behaviors: ['Quản lý nhiều dự án HR cùng lúc', 'Phân bổ nguồn lực hợp lý'] },
      { level: 4, description: 'Tốt', behaviors: ['Tối ưu hóa quy trình làm việc cho cả team'] },
      { level: 5, description: 'Xuất sắc', behaviors: ['Xây dựng hệ thống quản lý hiệu suất cho tổ chức'] }
    ],
    weight: 2, status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  }
];

export const SEED_POSITION_COMPETENCIES: PositionCompetency[] = [
  // Senior Backend Developer requires high knowledge, good teamwork, high focus on result
  { id: 'pc-1', positionId: 'pos-8', competencyId: 'comp-1', requiredLevel: 4, weight: 3 },
  { id: 'pc-2', positionId: 'pos-8', competencyId: 'comp-2', requiredLevel: 3, weight: 2 },
  { id: 'pc-3', positionId: 'pos-8', competencyId: 'comp-3', requiredLevel: 4, weight: 2 },
  { id: 'pc-4', positionId: 'pos-8', competencyId: 'comp-4', requiredLevel: 4, weight: 3 },
  { id: 'pc-5', positionId: 'pos-8', competencyId: 'comp-5', requiredLevel: 3, weight: 1 },
  // Junior Backend Developer requires less
  { id: 'pc-6', positionId: 'pos-7', competencyId: 'comp-1', requiredLevel: 2, weight: 3 },
  { id: 'pc-7', positionId: 'pos-7', competencyId: 'comp-2', requiredLevel: 2, weight: 2 },
  { id: 'pc-8', positionId: 'pos-7', competencyId: 'comp-3', requiredLevel: 3, weight: 2 },
  { id: 'pc-9', positionId: 'pos-7', competencyId: 'comp-4', requiredLevel: 3, weight: 3 },
  // Tech Lead requires management
  { id: 'pc-10', positionId: 'pos-10', competencyId: 'comp-1', requiredLevel: 5, weight: 3 },
  { id: 'pc-11', positionId: 'pos-10', competencyId: 'comp-2', requiredLevel: 4, weight: 2 },
  { id: 'pc-12', positionId: 'pos-10', competencyId: 'comp-3', requiredLevel: 5, weight: 3 },
  { id: 'pc-13', positionId: 'pos-10', competencyId: 'comp-6', requiredLevel: 4, weight: 3 },

  // === Phòng Nhân sự ===
  // Nhân viên Tuyển dụng (pos-13) - Junior Recruiter
  { id: 'pc-14', positionId: 'pos-13', competencyId: 'comp-1', requiredLevel: 2, weight: 2 },
  { id: 'pc-15', positionId: 'pos-13', competencyId: 'comp-2', requiredLevel: 3, weight: 3 },
  { id: 'pc-16', positionId: 'pos-13', competencyId: 'comp-7', requiredLevel: 2, weight: 2 },
  { id: 'pc-17', positionId: 'pos-13', competencyId: 'comp-9', requiredLevel: 2, weight: 2 },
  { id: 'pc-18', positionId: 'pos-13', competencyId: 'comp-10', requiredLevel: 3, weight: 3 },
  { id: 'pc-19', positionId: 'pos-13', competencyId: 'comp-11', requiredLevel: 3, weight: 2 },

  // Chuyên viên Tuyển dụng (pos-14) - Senior Recruiter
  { id: 'pc-20', positionId: 'pos-14', competencyId: 'comp-1', requiredLevel: 3, weight: 2 },
  { id: 'pc-21', positionId: 'pos-14', competencyId: 'comp-2', requiredLevel: 4, weight: 3 },
  { id: 'pc-22', positionId: 'pos-14', competencyId: 'comp-7', requiredLevel: 4, weight: 3 },
  { id: 'pc-23', positionId: 'pos-14', competencyId: 'comp-9', requiredLevel: 3, weight: 2 },
  { id: 'pc-24', positionId: 'pos-14', competencyId: 'comp-10', requiredLevel: 4, weight: 3 },
  { id: 'pc-25', positionId: 'pos-14', competencyId: 'comp-5', requiredLevel: 3, weight: 1 },
  { id: 'pc-26', positionId: 'pos-14', competencyId: 'comp-4', requiredLevel: 3, weight: 2 },

  // Trưởng nhóm Tuyển dụng (pos-15) - TA Lead
  { id: 'pc-27', positionId: 'pos-15', competencyId: 'comp-1', requiredLevel: 4, weight: 2 },
  { id: 'pc-28', positionId: 'pos-15', competencyId: 'comp-2', requiredLevel: 5, weight: 3 },
  { id: 'pc-29', positionId: 'pos-15', competencyId: 'comp-7', requiredLevel: 5, weight: 3 },
  { id: 'pc-30', positionId: 'pos-15', competencyId: 'comp-6', requiredLevel: 4, weight: 3 },
  { id: 'pc-31', positionId: 'pos-15', competencyId: 'comp-9', requiredLevel: 4, weight: 2 },
  { id: 'pc-32', positionId: 'pos-15', competencyId: 'comp-10', requiredLevel: 5, weight: 3 },
  { id: 'pc-33', positionId: 'pos-15', competencyId: 'comp-4', requiredLevel: 4, weight: 2 },

  // Nhân viên Đào tạo (pos-16) - Training Coordinator
  { id: 'pc-34', positionId: 'pos-16', competencyId: 'comp-2', requiredLevel: 3, weight: 2 },
  { id: 'pc-35', positionId: 'pos-16', competencyId: 'comp-8', requiredLevel: 2, weight: 3 },
  { id: 'pc-36', positionId: 'pos-16', competencyId: 'comp-11', requiredLevel: 3, weight: 3 },
  { id: 'pc-37', positionId: 'pos-16', competencyId: 'comp-3', requiredLevel: 3, weight: 2 },
  { id: 'pc-38', positionId: 'pos-16', competencyId: 'comp-10', requiredLevel: 3, weight: 2 },

  // Chuyên viên L&D (pos-17) - L&D Specialist
  { id: 'pc-39', positionId: 'pos-17', competencyId: 'comp-1', requiredLevel: 4, weight: 2 },
  { id: 'pc-40', positionId: 'pos-17', competencyId: 'comp-2', requiredLevel: 4, weight: 2 },
  { id: 'pc-41', positionId: 'pos-17', competencyId: 'comp-8', requiredLevel: 4, weight: 3 },
  { id: 'pc-42', positionId: 'pos-17', competencyId: 'comp-6', requiredLevel: 3, weight: 2 },
  { id: 'pc-43', positionId: 'pos-17', competencyId: 'comp-9', requiredLevel: 3, weight: 2 },
  { id: 'pc-44', positionId: 'pos-17', competencyId: 'comp-4', requiredLevel: 4, weight: 2 },

  // Trưởng nhóm Đào tạo (pos-18) - L&D Manager
  { id: 'pc-45', positionId: 'pos-18', competencyId: 'comp-1', requiredLevel: 5, weight: 2 },
  { id: 'pc-46', positionId: 'pos-18', competencyId: 'comp-2', requiredLevel: 5, weight: 3 },
  { id: 'pc-47', positionId: 'pos-18', competencyId: 'comp-8', requiredLevel: 5, weight: 3 },
  { id: 'pc-48', positionId: 'pos-18', competencyId: 'comp-6', requiredLevel: 4, weight: 3 },
  { id: 'pc-49', positionId: 'pos-18', competencyId: 'comp-9', requiredLevel: 4, weight: 2 },
  { id: 'pc-50', positionId: 'pos-18', competencyId: 'comp-4', requiredLevel: 5, weight: 2 },

  // Nhân viên C&B (pos-19)
  { id: 'pc-51', positionId: 'pos-19', competencyId: 'comp-1', requiredLevel: 2, weight: 3 },
  { id: 'pc-52', positionId: 'pos-19', competencyId: 'comp-11', requiredLevel: 3, weight: 3 },
  { id: 'pc-53', positionId: 'pos-19', competencyId: 'comp-10', requiredLevel: 4, weight: 3 },
  { id: 'pc-54', positionId: 'pos-19', competencyId: 'comp-4', requiredLevel: 3, weight: 2 },

  // Chuyên viên C&B (pos-20)
  { id: 'pc-55', positionId: 'pos-20', competencyId: 'comp-1', requiredLevel: 4, weight: 3 },
  { id: 'pc-56', positionId: 'pos-20', competencyId: 'comp-6', requiredLevel: 3, weight: 2 },
  { id: 'pc-57', positionId: 'pos-20', competencyId: 'comp-10', requiredLevel: 5, weight: 3 },
  { id: 'pc-58', positionId: 'pos-20', competencyId: 'comp-11', requiredLevel: 4, weight: 2 },
  { id: 'pc-59', positionId: 'pos-20', competencyId: 'comp-7', requiredLevel: 3, weight: 2 },

  // Trưởng phòng Nhân sự (pos-21) - HR Manager
  { id: 'pc-60', positionId: 'pos-21', competencyId: 'comp-1', requiredLevel: 5, weight: 3 },
  { id: 'pc-61', positionId: 'pos-21', competencyId: 'comp-2', requiredLevel: 5, weight: 3 },
  { id: 'pc-62', positionId: 'pos-21', competencyId: 'comp-6', requiredLevel: 5, weight: 3 },
  { id: 'pc-63', positionId: 'pos-21', competencyId: 'comp-7', requiredLevel: 5, weight: 3 },
  { id: 'pc-64', positionId: 'pos-21', competencyId: 'comp-8', requiredLevel: 4, weight: 2 },
  { id: 'pc-65', positionId: 'pos-21', competencyId: 'comp-9', requiredLevel: 5, weight: 3 },
  { id: 'pc-66', positionId: 'pos-21', competencyId: 'comp-10', requiredLevel: 5, weight: 3 },
  { id: 'pc-67', positionId: 'pos-21', competencyId: 'comp-4', requiredLevel: 5, weight: 3 },
];

export const SEED_EMPLOYEES: Employee[] = [
  { id: 'emp-1', code: 'NV001', fullName: 'Nguyễn Văn Mạnh', email: 'manh.nv@company.vn', departmentId: 'dept-2', teamId: 'team-7', positionId: 'pos-10', level: 'Lead', managerId: null, startDate: '2020-01-15', status: 'active' },
  { id: 'emp-2', code: 'NV002', fullName: 'Trần Thị Hoa', email: 'hoa.tt@company.vn', departmentId: 'dept-2', teamId: 'team-7', positionId: 'pos-8', level: 'Senior', managerId: 'emp-1', startDate: '2021-03-20', status: 'active' },
  { id: 'emp-3', code: 'NV003', fullName: 'Lê Minh Tuấn', email: 'tuan.lm@company.vn', departmentId: 'dept-2', teamId: 'team-7', positionId: 'pos-7', level: 'Junior', managerId: 'emp-1', startDate: '2023-05-10', status: 'active' },
  { id: 'emp-4', code: 'NV004', fullName: 'Phạm Quang Dũng', email: 'dung.pq@company.vn', departmentId: 'dept-1', teamId: 'team-3', positionId: 'pos-5', level: 'Senior', managerId: null, startDate: '2022-11-01', status: 'active' },
  // === Phòng Nhân sự ===
  { id: 'emp-5', code: 'NV005', fullName: 'Võ Thị Mai Lan', email: 'lan.vtm@company.vn', departmentId: 'dept-3', teamId: 'team-12', positionId: 'pos-21', level: 'Manager', managerId: null, startDate: '2019-08-01', status: 'active' },
  { id: 'emp-6', code: 'NV006', fullName: 'Đặng Hoàng Nam', email: 'nam.dh@company.vn', departmentId: 'dept-3', teamId: 'team-10', positionId: 'pos-15', level: 'Lead', managerId: 'emp-5', startDate: '2020-03-15', status: 'active' },
  { id: 'emp-7', code: 'NV007', fullName: 'Bùi Thị Thanh Hằng', email: 'hang.btt@company.vn', departmentId: 'dept-3', teamId: 'team-10', positionId: 'pos-14', level: 'Senior', managerId: 'emp-6', startDate: '2021-06-10', status: 'active' },
  { id: 'emp-8', code: 'NV008', fullName: 'Hoàng Minh Phúc', email: 'phuc.hm@company.vn', departmentId: 'dept-3', teamId: 'team-10', positionId: 'pos-13', level: 'Junior', managerId: 'emp-6', startDate: '2024-01-08', status: 'active' },
  { id: 'emp-9', code: 'NV009', fullName: 'Ngô Thị Bích Ngọc', email: 'ngoc.ntb@company.vn', departmentId: 'dept-3', teamId: 'team-11', positionId: 'pos-18', level: 'Manager', managerId: 'emp-5', startDate: '2020-09-20', status: 'active' },
  { id: 'emp-10', code: 'NV010', fullName: 'Trịnh Văn Khoa', email: 'khoa.tv@company.vn', departmentId: 'dept-3', teamId: 'team-11', positionId: 'pos-17', level: 'Senior', managerId: 'emp-9', startDate: '2022-02-14', status: 'active' },
  { id: 'emp-11', code: 'NV011', fullName: 'Lý Thị Kim Anh', email: 'anh.ltk@company.vn', departmentId: 'dept-3', teamId: 'team-11', positionId: 'pos-16', level: 'Junior', managerId: 'emp-9', startDate: '2024-07-01', status: 'probation' },
  { id: 'emp-12', code: 'NV012', fullName: 'Phan Đức Thắng', email: 'thang.pd@company.vn', departmentId: 'dept-3', teamId: 'team-12', positionId: 'pos-20', level: 'Senior', managerId: 'emp-5', startDate: '2021-11-05', status: 'active' },
  { id: 'emp-13', code: 'NV013', fullName: 'Dương Thị Hạnh', email: 'hanh.dt@company.vn', departmentId: 'dept-3', teamId: 'team-12', positionId: 'pos-19', level: 'Junior', managerId: 'emp-12', startDate: '2023-09-18', status: 'active' },
];

export const SEED_EVALUATION_PERIODS: EvaluationPeriod[] = [
  { id: 'ep-1', name: 'Đánh giá Q1-Q2/2025', startDate: '2025-06-01', endDate: '2025-06-30', status: 'active' },
  { id: 'ep-2', name: 'Đánh giá Q3-Q4/2024', startDate: '2024-12-01', endDate: '2024-12-31', status: 'closed' },
];

export const SEED_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval-1', employeeId: 'emp-2', periodId: 'ep-1', type: 'self', evaluatorId: 'emp-2',
    competencyScores: [
      { competencyId: 'comp-1', competencyName: 'Hiểu về chuyên môn nghiệp vụ', askGroup: 'knowledge', requiredLevel: 4, selfScore: 4, managerScore: 4, peerScore: null, finalScore: 4, gap: 0, gapClassification: 'met', weight: 3, evidence: 'Đã hoàn thành tốt các task phức tạp', evaluatorComment: '' },
      { competencyId: 'comp-2', competencyName: 'Kỹ năng giao tiếp', askGroup: 'skill', requiredLevel: 3, selfScore: 4, managerScore: 3, peerScore: null, finalScore: 3.5, gap: 0.5, gapClassification: 'met', weight: 2, evidence: 'Trao đổi rõ ràng với team QA', evaluatorComment: '' },
      { competencyId: 'comp-3', competencyName: 'Kỹ năng làm việc nhóm', askGroup: 'skill', requiredLevel: 4, selfScore: 3, managerScore: 3, peerScore: null, finalScore: 3, gap: -1, gapClassification: 'needs_improvement', weight: 2, evidence: 'Cần tích cực hơn trong các buổi retro', evaluatorComment: '' },
      { competencyId: 'comp-4', competencyName: 'Tập trung vào kết quả', askGroup: 'attitude', requiredLevel: 4, selfScore: 4, managerScore: 4, peerScore: null, finalScore: 4, gap: 0, gapClassification: 'met', weight: 3, evidence: 'Không miss deadline nào trong quý', evaluatorComment: '' },
      { competencyId: 'comp-5', competencyName: 'Trình độ ngoại ngữ', askGroup: 'knowledge', requiredLevel: 3, selfScore: 2, managerScore: 2, peerScore: null, finalScore: 2, gap: -1, gapClassification: 'needs_improvement', weight: 1, evidence: 'Đọc tài liệu tiếng anh còn chậm', evaluatorComment: '' },
    ],
    weightedTotalScore: 3.6, overallComment: 'Kỳ này làm khá tốt nhưng cần trau dồi thêm tiếng Anh và kỹ năng teamwork.', status: 'completed', createdAt: '2025-06-15T10:00:00Z', updatedAt: '2025-06-15T10:00:00Z'
  },
  // === Đánh giá nhân viên Phòng HR ===
  {
    id: 'eval-2', employeeId: 'emp-7', periodId: 'ep-1', type: 'manager', evaluatorId: 'emp-6',
    competencyScores: [
      { competencyId: 'comp-1', competencyName: 'Hiểu về chuyên môn nghiệp vụ', askGroup: 'knowledge', requiredLevel: 3, selfScore: 3, managerScore: 3, peerScore: null, finalScore: 3, gap: 0, gapClassification: 'met', weight: 2, evidence: 'Nắm vững quy trình tuyển dụng, sàng lọc hồ sơ chính xác', evaluatorComment: '' },
      { competencyId: 'comp-2', competencyName: 'Kỹ năng giao tiếp', askGroup: 'skill', requiredLevel: 4, selfScore: 4, managerScore: 4, peerScore: null, finalScore: 4, gap: 0, gapClassification: 'met', weight: 3, evidence: 'Phỏng vấn rất tốt, ứng viên đánh giá cao trải nghiệm', evaluatorComment: 'Giao tiếp rất tự tin' },
      { competencyId: 'comp-7', competencyName: 'Kỹ năng đàm phán và thuyết phục', askGroup: 'skill', requiredLevel: 4, selfScore: 3, managerScore: 3, peerScore: null, finalScore: 3, gap: -1, gapClassification: 'needs_improvement', weight: 3, evidence: 'Đàm phán offer mức junior-mid tốt, nhưng chưa xử lý tốt ứng viên senior', evaluatorComment: 'Cần rèn luyện thêm kỹ năng thương lượng' },
      { competencyId: 'comp-9', competencyName: 'Kỹ năng quản trị mối quan hệ', askGroup: 'skill', requiredLevel: 3, selfScore: 4, managerScore: 4, peerScore: null, finalScore: 4, gap: 1, gapClassification: 'met', weight: 2, evidence: 'Xây dựng được mạng lưới ứng viên tốt trên LinkedIn', evaluatorComment: 'Vượt kỳ vọng' },
      { competencyId: 'comp-10', competencyName: 'Trung thực và bảo mật', askGroup: 'attitude', requiredLevel: 4, selfScore: 4, managerScore: 5, peerScore: null, finalScore: 5, gap: 1, gapClassification: 'met', weight: 3, evidence: 'Luôn tuân thủ bảo mật thông tin ứng viên và lương', evaluatorComment: 'Rất đáng tin cậy' },
      { competencyId: 'comp-5', competencyName: 'Trình độ ngoại ngữ', askGroup: 'knowledge', requiredLevel: 3, selfScore: 3, managerScore: 3, peerScore: null, finalScore: 3, gap: 0, gapClassification: 'met', weight: 1, evidence: 'Phỏng vấn bằng tiếng Anh tốt', evaluatorComment: '' },
      { competencyId: 'comp-4', competencyName: 'Tập trung vào kết quả', askGroup: 'attitude', requiredLevel: 3, selfScore: 3, managerScore: 3, peerScore: null, finalScore: 3, gap: 0, gapClassification: 'met', weight: 2, evidence: 'Đạt 90% KPI tuyển dụng Q1-Q2', evaluatorComment: '' },
    ],
    weightedTotalScore: 3.6, overallComment: 'Hằng là recruiter có năng lực tốt, giao tiếp và xây dựng quan hệ vượt trội. Cần cải thiện kỹ năng đàm phán với ứng viên cấp cao để sẵn sàng cho vai trò TA Lead tương lai.', status: 'completed', createdAt: '2025-06-18T09:00:00Z', updatedAt: '2025-06-18T09:00:00Z'
  },
  {
    id: 'eval-3', employeeId: 'emp-8', periodId: 'ep-1', type: 'manager', evaluatorId: 'emp-6',
    competencyScores: [
      { competencyId: 'comp-1', competencyName: 'Hiểu về chuyên môn nghiệp vụ', askGroup: 'knowledge', requiredLevel: 2, selfScore: 2, managerScore: 2, peerScore: null, finalScore: 2, gap: 0, gapClassification: 'met', weight: 2, evidence: 'Đã nắm quy trình cơ bản sau 6 tháng', evaluatorComment: '' },
      { competencyId: 'comp-2', competencyName: 'Kỹ năng giao tiếp', askGroup: 'skill', requiredLevel: 3, selfScore: 2, managerScore: 2, peerScore: null, finalScore: 2, gap: -1, gapClassification: 'needs_improvement', weight: 3, evidence: 'Còn rụt rè khi phỏng vấn, cần luyện tập thêm', evaluatorComment: 'Cần tự tin hơn' },
      { competencyId: 'comp-7', competencyName: 'Kỹ năng đàm phán và thuyết phục', askGroup: 'skill', requiredLevel: 2, selfScore: 1, managerScore: 1, peerScore: null, finalScore: 1, gap: -1, gapClassification: 'needs_improvement', weight: 2, evidence: 'Chưa có kinh nghiệm đàm phán offer', evaluatorComment: 'Cần được mentor' },
      { competencyId: 'comp-9', competencyName: 'Kỹ năng quản trị mối quan hệ', askGroup: 'skill', requiredLevel: 2, selfScore: 2, managerScore: 2, peerScore: null, finalScore: 2, gap: 0, gapClassification: 'met', weight: 2, evidence: 'Xây dựng quan hệ tốt với các hiring manager', evaluatorComment: '' },
      { competencyId: 'comp-10', competencyName: 'Trung thực và bảo mật', askGroup: 'attitude', requiredLevel: 3, selfScore: 3, managerScore: 3, peerScore: null, finalScore: 3, gap: 0, gapClassification: 'met', weight: 3, evidence: 'Tuân thủ tốt quy định bảo mật', evaluatorComment: '' },
      { competencyId: 'comp-11', competencyName: 'Kỹ năng tổ chức và quản lý thời gian', askGroup: 'skill', requiredLevel: 3, selfScore: 2, managerScore: 2, peerScore: null, finalScore: 2, gap: -1, gapClassification: 'needs_improvement', weight: 2, evidence: 'Đôi khi trễ deadline sàng lọc hồ sơ', evaluatorComment: 'Cần cải thiện time management' },
    ],
    weightedTotalScore: 2.1, overallComment: 'Phúc mới vào team 6 tháng, đang trong giai đoạn học hỏi. Cần được mentor nhiều hơn về kỹ năng phỏng vấn, đàm phán và quản lý thời gian. Thái độ làm việc tốt, chịu khó.', status: 'completed', createdAt: '2025-06-18T10:00:00Z', updatedAt: '2025-06-18T10:00:00Z'
  },
  {
    id: 'eval-4', employeeId: 'emp-10', periodId: 'ep-1', type: 'manager', evaluatorId: 'emp-9',
    competencyScores: [
      { competencyId: 'comp-1', competencyName: 'Hiểu về chuyên môn nghiệp vụ', askGroup: 'knowledge', requiredLevel: 4, selfScore: 4, managerScore: 4, peerScore: null, finalScore: 4, gap: 0, gapClassification: 'met', weight: 2, evidence: 'Thiết kế được chương trình đào tạo phức tạp, áp dụng mô hình ADDIE hiệu quả', evaluatorComment: '' },
      { competencyId: 'comp-2', competencyName: 'Kỹ năng giao tiếp', askGroup: 'skill', requiredLevel: 4, selfScore: 4, managerScore: 4, peerScore: null, finalScore: 4, gap: 0, gapClassification: 'met', weight: 2, evidence: 'Dẫn dắt workshop rất tốt, nhận phản hồi tích cực từ học viên', evaluatorComment: '' },
      { competencyId: 'comp-8', competencyName: 'Kỹ năng đào tạo', askGroup: 'skill', requiredLevel: 4, selfScore: 3, managerScore: 3, peerScore: null, finalScore: 3, gap: -1, gapClassification: 'needs_improvement', weight: 3, evidence: 'Thiết kế nội dung tốt nhưng kỹ năng facilitation cần cải thiện thêm', evaluatorComment: 'Cần học thêm kỹ thuật đào tạo tương tác' },
      { competencyId: 'comp-6', competencyName: 'Phân tích và ra quyết định', askGroup: 'skill', requiredLevel: 3, selfScore: 3, managerScore: 3, peerScore: null, finalScore: 3, gap: 0, gapClassification: 'met', weight: 2, evidence: 'Phân tích nhu cầu đào tạo chính xác, đề xuất hợp lý', evaluatorComment: '' },
      { competencyId: 'comp-9', competencyName: 'Kỹ năng quản trị mối quan hệ', askGroup: 'skill', requiredLevel: 3, selfScore: 3, managerScore: 4, peerScore: null, finalScore: 4, gap: 1, gapClassification: 'met', weight: 2, evidence: 'Phối hợp tốt với các phòng ban để xác định nhu cầu đào tạo', evaluatorComment: 'Vượt kỳ vọng' },
      { competencyId: 'comp-4', competencyName: 'Tập trung vào kết quả', askGroup: 'attitude', requiredLevel: 4, selfScore: 4, managerScore: 4, peerScore: null, finalScore: 4, gap: 0, gapClassification: 'met', weight: 2, evidence: 'Hoàn thành 100% kế hoạch đào tạo Q1-Q2', evaluatorComment: '' },
    ],
    weightedTotalScore: 3.5, overallComment: 'Khoa là chuyên viên L&D có tiềm năng, thiết kế nội dung tốt. Cần đầu tư thêm vào kỹ năng facilitation và các phương pháp đào tạo hiện đại (blended learning, micro-learning) để sẵn sàng lên vị trí L&D Manager.', status: 'completed', createdAt: '2025-06-20T14:00:00Z', updatedAt: '2025-06-20T14:00:00Z'
  }
];

export const SEED_IDP_ITEMS: IDPItem[] = [
  {
    id: 'idp-1', employeeId: 'emp-2', competencyId: 'comp-3', competencyName: 'Kỹ năng làm việc nhóm',
    developmentGoal: 'Chủ động đưa ra ý kiến đóng góp trong các buổi họp nhóm', trainingActions: 'Tham gia điều phối 2 buổi họp retro của team',
    responsiblePerson: 'emp-1', deadline: '2025-09-30', status: 'in_progress', progressNotes: 'Đã điều phối 1 buổi',
    createdAt: '2025-06-20T10:00:00Z', updatedAt: '2025-06-20T10:00:00Z'
  },
  // === IDP cho nhân viên HR ===
  {
    id: 'idp-2', employeeId: 'emp-7', competencyId: 'comp-7', competencyName: 'Kỹ năng đàm phán và thuyết phục',
    developmentGoal: 'Nâng cao kỹ năng đàm phán offer cho ứng viên cấp Senior/Lead', trainingActions: 'Tham gia khóa học Negotiation Skills (2 ngày); Shadow 5 buổi đàm phán offer senior cùng TA Lead',
    responsiblePerson: 'emp-6', deadline: '2025-10-31', status: 'in_progress', progressNotes: 'Đã hoàn thành khóa học, đang shadow buổi thứ 3',
    createdAt: '2025-06-25T09:00:00Z', updatedAt: '2025-07-10T09:00:00Z'
  },
  {
    id: 'idp-3', employeeId: 'emp-8', competencyId: 'comp-2', competencyName: 'Kỹ năng giao tiếp',
    developmentGoal: 'Tự tin hơn khi phỏng vấn ứng viên, giảm sự rụt rè', trainingActions: 'Luyện phỏng vấn mock 2 lần/tuần với Chị Hằng (emp-7); Tham gia khóa Public Speaking nội bộ',
    responsiblePerson: 'emp-7', deadline: '2025-12-31', status: 'in_progress', progressNotes: 'Đã phỏng vấn mock 6 buổi, có tiến bộ rõ rệt',
    createdAt: '2025-06-25T10:00:00Z', updatedAt: '2025-07-15T10:00:00Z'
  },
  {
    id: 'idp-4', employeeId: 'emp-8', competencyId: 'comp-11', competencyName: 'Kỹ năng tổ chức và quản lý thời gian',
    developmentGoal: 'Hoàn thành sàng lọc hồ sơ đúng deadline 100%', trainingActions: 'Áp dụng phương pháp Eisenhower Matrix; Sử dụng Trello để theo dõi pipeline tuyển dụng',
    responsiblePerson: 'emp-6', deadline: '2025-09-30', status: 'not_started', progressNotes: '',
    createdAt: '2025-06-25T10:30:00Z', updatedAt: '2025-06-25T10:30:00Z'
  },
  {
    id: 'idp-5', employeeId: 'emp-10', competencyId: 'comp-8', competencyName: 'Kỹ năng đào tạo',
    developmentGoal: 'Cải thiện kỹ năng facilitation và áp dụng phương pháp đào tạo tương tác', trainingActions: 'Tham gia chứng chỉ Certified Facilitator; Nghiên cứu và áp dụng micro-learning cho 2 chương trình nội bộ',
    responsiblePerson: 'emp-9', deadline: '2025-11-30', status: 'in_progress', progressNotes: 'Đang học online module 3/6 của chứng chỉ Facilitator',
    createdAt: '2025-06-25T14:00:00Z', updatedAt: '2025-07-20T14:00:00Z'
  }
];

export const SEED_AI_REPORTS: AIReport[] = [];
