import React from 'react';
import tamGuong1 from '../../../assets/image/tamGuong1.jpg'; // Adjust path if necessary

function SuccessStoryHoChiMinh () {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Chủ tịch Hồ Chí Minh và hành trình từ bỏ thuốc lá
      </h1>
      
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
        {/* Left Column: Content */}
        <div className="lg:w-full space-y-4 text-gray-700 leading-relaxed">
          <p>
            Chủ tịch Hồ Chí Minh – một con người suốt đời nêu gương sáng về tinh thần tự rèn luyện – từng thừa nhận rằng mình có một thói quen xấu là hút thuốc lá. Thói quen này bắt nguồn từ những năm 1920, khi Người hoạt động cách mạng ở Pháp dưới tên Nguyễn Ái Quốc.
          </p>
          <p>
            Đồng chí Vũ Kỳ – thư ký riêng của Bác – kể lại: Trong thời gian bị mật thám Pháp theo dõi ráo riết, Bác tìm cách quan sát kẻ theo dõi mà không bị lộ. Một trong những cách ấy là châm thuốc hút khi đi gần thùng rác, rồi quay lại vứt que diêm. Nhờ đó, Bác có thể quan sát xung quanh một cách tự nhiên. Ban đầu chỉ là hành động có chủ đích, lâu dần trở thành thói quen thực sự.
          </p>
          <p>
            Đến năm 1966, do sức khỏe suy giảm, bác sĩ đề nghị Bác bỏ thuốc. Bác đồng ý và chủ động lập một kế hoạch bỏ thuốc dần dần. Bác nói với anh em phục vụ:
          </p>
          <p className="italic pl-4 border-l-4 border-blue-500">
            “Bác hút thuốc từ lúc còn trẻ, nay đã thành thói quen. Bây giờ bỏ thì tốt, nhưng không dễ. Các chú phải giúp Bác bỏ tật xấu này.”
          </p>
          <div className="flex justify-center my-6">
            <img
              src={tamGuong1}
              alt="Chủ tịch Hồ Chí Minh đang hút thuốc"
              className="w-full lg:w-2/3 object-cover"
            />
          </div>
          
          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
            Cách Bác Hồ cai thuốc: từ ý chí đến hành động cụ thể
          </h2>
          <p>
            Bác không bỏ ngay lập tức, mà thực hiện từng bước:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Giảm dần số lượng thuốc trong ngày.</li>
            <li>Mỗi khi thèm thuốc, Bác chuyển sang làm một việc khác để phân tán sự chú ý.</li>
            <li>Bác yêu cầu để một lọ Penixilin rỗng ở phòng làm việc và phòng nghỉ. Mỗi lần hút nửa điếu, Bác dụi đi và để vào lọ đó. Khi thèm, Bác mới lấy ra hút nốt.</li>
            <li>Dù anh em khuyên không nên hút thuốc dở vì có hại, Bác chỉ nhẹ nhàng nói: "Nhưng hút để có cữ."</li>
          </ul>
          <p>
            Nhờ kiên trì như vậy, từ chỗ hút một bao mỗi ngày, Bác giảm xuống còn 3–4 điếu, rồi thưa dần.
          </p>
          <p>
            Đến tháng 3 năm 1968, nhân dịp bị cảm nhẹ, Bác quyết định bỏ hẳn. Gói thuốc vẫn để nguyên trên bàn, nhưng Bác không đụng tới. Một tháng sau, khi tiếp đồng chí Vũ Quang – Bí thư Trung ương Đoàn lúc bấy giờ – Bác nói:
          </p>
          <p className="italic pl-4 border-l-4 border-blue-500">
            “Bác bỏ thuốc lá rồi. Chú về vận động thanh niên đừng hút thuốc.”
          </p>
          <p>
            Sau đó, Bác làm thơ ghi lại cảm xúc:
          </p>
          <p className="text-center font-mono mt-4 mb-4">
            Vô đề<br/>
            “Thuốc kiêng rượu cữ đã ba năm,<br/>
            Không bệnh là tiên sướng tuyệt trần.<br/>
            Mừng thấy miền Nam luôn thắng lớn,<br/>
            Một năm là cả bốn mùa Xuân.”
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
            Một bài học từ cuộc sống đời thường
          </h2>
          <p>
            Hành động bỏ thuốc của Bác tuy nhỏ bé, đời thường, nhưng phản ánh ý chí tự chiến thắng bản thân, tinh thần gương mẫu và sự nhất quán giữa lời nói và hành động. Bác từng nói: "Nói phải đi đôi với làm." Chính vì vậy, việc bỏ thuốc lá không chỉ vì sức khỏe, mà còn để làm gương cho cán bộ, nhân dân và đặc biệt là thế hệ trẻ.
          </p>
          <p>
            Ngày nay, trong khi nhiều người trẻ còn xem thường tác hại của thuốc lá, thì câu chuyện này của Bác Hồ càng đáng để suy ngẫm. Bỏ thuốc không dễ, nhưng có thể – nếu có quyết tâm và mục đích rõ ràng.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SuccessStoryHoChiMinh ;