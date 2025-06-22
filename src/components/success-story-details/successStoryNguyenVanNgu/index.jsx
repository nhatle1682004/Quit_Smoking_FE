import React from 'react';
import tamGuong2 from '../../../assets/image/tamGuong2.jpg'; // Adjust path if necessary

function SuccessStoryNguyenVanNgu() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Ông Nguyễn Văn Ngư – Người ông Bắc Ninh quyết tâm bỏ thuốc vì sức khỏe con cháu
      </h1>
      <hr />
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Vì không muốn các cháu nội, ngoại hít phải khói thuốc và bị ảnh hưởng sức khỏe, ông Nguyễn Văn Ngư, 60 tuổi, ở thôn Đồng Xoài, xã Đại Đồng, huyện Thuận Thành, tỉnh Bắc Ninh, đã quyết tâm cai thuốc lá sau hàng chục năm nghiện nặng.
        </p>


        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
          Từ thói quen khó bỏ đến thay đổi tích cực
        </h2>
        <p>
          Ông Ngư bắt đầu hút thuốc từ năm 17 tuổi, ban đầu là thuốc lá cuộn mua ở Lạng Sơn, dần chuyển sang thuốc lá đóng bao. Có thời điểm, ông hút 2 bao mỗi ngày, tiêu tốn khoảng 600.000 đồng mỗi tháng, một khoản không nhỏ với người làm nông.
        </p>
        <p>
          Nhiều lần ông cố bỏ thuốc nhưng không thành công, do tác động từ môi trường xung quanh, thói quen ăn sâu, tâm lý căng thẳng và thời gian rảnh rỗi. Khi đang làm việc hay thậm chí đang ăn cơm, ông vẫn bỏ dở để hút thuốc.
        </p>
        <p>
          Sức khỏe cũng bị ảnh hưởng. Khi đi khám, bác sĩ cảnh báo cuống phổi ông đậm hơn bình thường, tiềm ẩn nguy cơ bệnh lý. Tuy nhiên, điều thôi thúc ông bỏ thuốc không phải chỉ là sức khỏe của bản thân, mà chính là vì các cháu nhỏ.
        </p>
        <div className="flex justify-center my-6">
          <img
            src={tamGuong2}
            alt="Ông Phạm văn Ngư cùng các cháu"
            className="w-full lg:w-2/3 object-cover"
          />
        </div>
        <p className="italic pl-4 border-l-4 border-blue-500">
          "Mỗi lần tôi hút thuốc, các cháu nhăn mặt, chạy ra xa và bảo: 'Ông bỏ thuốc lá đi, cô giáo nói thuốc lá có hại cho sức khỏe và ảnh hưởng đến người xung quanh'. Nghe vậy, tôi thực sự suy nghĩ", ông chia sẻ.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
          Hành trình bỏ thuốc lá nhờ sự hỗ trợ đúng cách
        </h2>
        <p>
          Sau khi quyết tâm cai, ông Ngư chủ động tìm hiểu thông tin, học theo những người từng bỏ thuốc thành công và liên hệ tổng đài tư vấn cai nghiện thuốc lá miễn phí 1800 6606 của Bệnh viện Bạch Mai.
        </p>
        <p>
          Tại đây, ông được tư vấn viên theo dõi, hướng dẫn cụ thể. Mỗi khi thèm thuốc, ông áp dụng mẹo nhỏ: cắn một miếng quế cho tê lưỡi, rồi nhai kẹo cao su để làm dịu cảm giác thèm. Cách làm đơn giản nhưng giúp ông vượt qua những lúc "khó chịu nhất".
        </p>
        <p>
          Nhờ sự kiên trì, kỷ luật và quyết tâm, đến nay đã tròn 3 năm ông không đụng đến điếu thuốc nào. Cuộc sống của ông thay đổi tích cực: ăn uống điều độ, tập thể dục đều đặn, tinh thần vui vẻ và được người dân trong xóm khen "trẻ hơn tuổi", "da dẻ hồng hào".
        </p>
        <p className="italic pl-4 border-l-4 border-blue-500">
          "Bỏ thuốc không đơn giản, nhất là với người nghiện lâu năm như tôi. Nhưng nếu quyết tâm thực sự và có cách làm đúng, thì ai cũng có thể làm được", ông khẳng định.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
          Cảnh báo từ thực tế và số liệu
        </h2>
        <p>
          Theo Tổ chức Y tế Thế giới (WHO), 90% bệnh nhân phổi có liên quan đến thuốc lá, và đây là nguyên nhân dẫn tới 73% ca tử vong do bệnh phổi – phần lớn ở các nước có thu nhập trung bình và thấp. Nếu không kiểm soát, 1 tỷ người có thể chết vì thuốc lá trong thế kỷ 21.
        </p>
        <p>
          Tại Việt Nam, thống kê cho thấy 96,8% bệnh nhân phổi có liên quan đến hút thuốc lá. Người hút thuốc có nguy cơ mắc ung thư phổi cao gấp 22 lần so với người không hút, và 1/5 người hút thuốc có nguy cơ mắc bệnh phổi tắc nghẽn mạn tính – căn bệnh khó chữa trị.
        </p>
      </div>
    </div>
  );
}

export default SuccessStoryNguyenVanNgu;