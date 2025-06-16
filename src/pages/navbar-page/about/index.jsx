import React from 'react';
import { FaBook, FaFileAlt, FaComments, FaBrain } from 'react-icons/fa';
import info from '../../../assets/image/info.jpg';
import { useNavigate } from 'react-router-dom';

function InformationPage() {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-xl !text-black ">
                Cổng thông tin hỗ trợ cai thuốc lá tại Việt Nam
              </h1>
              <hr className='border border-blue-500 mb-8' />
              <h2 className="text-lg font-semibold text-blue-800">Giới thiệu chung</h2>
              <p className="text-gray-800 leading-relaxed">
                Với mong muốn góp phần cải thiện sức khỏe cộng đồng và hỗ trợ hiệu quả quá trình từ bỏ thuốc lá/thuốc lào, trang mạng <button onClick={handleHomeClick} className="font-extrabold hover:text-blue-600 transition-colors duration-200">www.quitsmoke.fun</button> được xây dựng như một cổng thông tin điện tử toàn diện và tin cậy dành cho tất cả những ai đang có nhu cầu cai thuốc tại Việt Nam.
              </p>
              <p className="text-gray-800 leading-relaxed">
                Dự án được phát triển với sự hợp tác giữa các chuyên gia y tế, tổ chức nghiên cứu sức khỏe cộng đồng trong và ngoài nước, nhằm mang đến một nền tảng số hỗ trợ thiết thực và khoa học trong việc từ bỏ thuốc lá/thuốc lào.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-blue-800">Mục đích</h2>
              <p className="text-gray-800 leading-relaxed">
                Cổng thông tin quitsmoke.fun ra đời với mục tiêu chính là:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                <li>Cung cấp thông tin chính xác, đáng tin cậy về tác hại của thuốc lá, lợi ích của việc cai thuốc, và các phương pháp hỗ trợ hiệu quả.</li>
                <li>Hỗ trợ người hút thuốc và cán bộ y tế trong việc tìm kiếm kiến thức, công cụ, tài liệu, và lời khuyên hữu ích phục vụ quá trình cai nghiện thuốc lá/thuốc lào.</li>
                <li>Góp phần giảm tỷ lệ hút thuốc trong cộng đồng, từ đó nâng cao chất lượng cuộc sống cho cá nhân, gia đình và toàn xã hội.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-blue-800">Tính năng nổi bật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <FaBook className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Hướng dẫn cụ thể</h3>
                    <p className="text-gray-800">Các bước cai thuốc, xử lý cơn thèm thuốc, và kỹ thuật kiểm soát hành vi.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <FaFileAlt className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Công cụ</h3>
                    <p className="text-gray-800">Bộ công cụ đánh giá mức độ lệ thuộc nicotine, thiết kế kế hoạch can thiệp phù hợp theo từng đối tượng.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <FaComments className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Chia sẻ kinh nghiệm</h3>
                    <p className="text-gray-800">Câu chuyện thật và lời khuyên từ những người đã và đang cai thuốc.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <FaBrain className="text-2xl text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-900">Hỗ trợ toàn diện</h3>
                    <p className="text-gray-800">Nội dung về tâm lý, dinh dưỡng và luyện tập hỗ trợ cai thuốc hiệu quả.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-blue-800">Thông tin bản quyền</h2>
              <p className="text-gray-800 leading-relaxed">
                Tất cả thông tin, bài viết, hướng dẫn và tài liệu truyền thông được đăng tải trên quitsmoke.fun thuộc bản quyền của nhóm phát triển nền tảng. Khi sử dụng hoặc chia sẻ lại, vui lòng ghi rõ tên tác giả và nguồn <button onClick={handleHomeClick} className="font-extrabold hover:text-blue-600 transition-colors duration-200">www.quitsmoke.fun</button> để đảm bảo quyền tác giả và tính minh bạch thông tin.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-full">
            <img
              src={info}
              alt="Smoking Cessation Support"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InformationPage;