import React from 'react';
import { useNavigate } from 'react-router-dom';
import tamGuong1 from '../../../assets/image/tamGuong1.jpg'
import tamGuong2 from '../../../assets/image/tamGuong2.jpg'
import tamGuong3 from '../../../assets/image/tamGuong3.jpg'



function SuccessStories() {
  const navigate = useNavigate();

  const handleStoryClick = (storyId) => {
    navigate(`/success/success-story-details/${storyId}`);
  };

  return (
    <div className="container mx-auto px-6">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Câu Chuyện Thành Công</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hàng nghìn người đã thành công cai thuốc lá với sự hỗ trợ của
              chúng tôi. Đây là một số câu chuyện từ họ.
            </p>
          </div>
        </div>
      <hr />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Story 1 */}
        <div className="story-item text-center p-6 bg-white rounded-lg shadow-lg">
          <img
            src={tamGuong1}
            alt="Person 1"
            className="story-image w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-white"
            onClick={() => handleStoryClick(1)}
          />
          <h3 className="text-2xl font-semibold mb-2 text-red-600 cursor-pointer" onClick={() => handleStoryClick(1)}>
            Nhưng mình phải quyết tâm, không hút nữa
          </h3>
          <p className="text-gray-700">
            Bác tự đề ra chương trình bỏ thuốc dần dần. Lúc đầu là
            giảm số lượng điếu hút trong ngày. Khi thèm hút thuốc Bác
            làm một việc gì đó để thu hút sự chú ý, tập trung.
          </p>
        </div>

        {/* Story 2 */}
        <div className="story-item text-center p-6 bg-white rounded-lg shadow-lg">
          <img
            src={tamGuong2}
            alt="Person 2"
            className="story-image w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-white"
            onClick={() => handleStoryClick(2)}
          />
          <h3 className="text-2xl font-semibold mb-2 text-red-600 cursor-pointer" onClick={() => handleStoryClick(2)}>
            Cai thuốc để làm gương cho con cháu
          </h3>
          <p className="text-gray-700">
            Cai thuốc lá phải tự mình kiên trì...Nhưng mình phải quyết
            tâm, không hút nữa.
          </p>
        </div>

        {/* Story 3 */}
        <div className="story-item text-center p-6 bg-white rounded-lg shadow-lg">
          <img
            src={tamGuong3}
            alt="Person 3"
            className="story-image w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-white"
            onClick={() => handleStoryClick(3)}
          />
          <h3 className="text-2xl font-semibold mb-2 text-red-600 cursor-pointer" onClick={() => handleStoryClick(3)}>
            Cai thuốc lá vì hạnh phúc, tương lai con cháu
          </h3>
          <p className="text-gray-700">
            Bản thân mình thật lắm lúc cũng nghĩ, hút thuốc lá là thì thôi
            tuổi già chết cũng được, nhưng không phải đâu, phải vì
            tương lai các cháu
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuccessStories;
