import React from 'react'

function KnowledgePage() {
  return (
    <div className='min-h-screen py-15 px-20'>
      <div className='container mx-auto px-4'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>Kiến Thức Chung Về Cai Nghiện Thuốc Lá</h1>
        <div className='bg-blue-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg shadow-sm'>
          <p className='text-lg text-gray-700 leading-relaxed'>
            <span className='font-semibold text-blue-700'>Tổng hợp kiến thức khoa học</span> về thuốc lá và quá trình cai nghiện, giúp bạn:
          </p>
          <ul className='mt-4 space-y-2 text-gray-600'>
            <li className='flex items-center'>
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Hiểu rõ về thành phần và cơ chế gây nghiện của thuốc lá
            </li>
            <li className='flex items-center'>
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Nắm được tác hại nghiêm trọng đến sức khỏe và cuộc sống
            </li>
            <li className='flex items-center'>
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Khám phá lợi ích tuyệt vời khi bỏ thuốc lá
            </li>
            <li className='flex items-center'>
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Tìm hiểu các phương pháp cai nghiện hiệu quả
            </li>
          </ul>
        </div>
      </div>
      <hr className='border border-blue-500 mb-8' />

      <div className='container mx-auto px-4 space-y-8'>
        {/* Phần 1: Giới thiệu */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>1. Giới thiệu: Vì sao cần cai nghiện thuốc lá</h2>
          <div className='space-y-4 text-lg'>
            <p>
              Hút thuốc lá là một trong những nguyên nhân gây tử vong hàng đầu nhưng hoàn toàn có thể phòng tránh được. Theo Tổ chức Y tế Thế giới (WHO), mỗi năm thế giới ghi nhận hơn 8 triệu ca tử vong do các bệnh liên quan đến thuốc lá. Trong số đó, khoảng 1,3 triệu người là nạn nhân của hút thuốc thụ động – những người không hút nhưng vẫn hít phải khói thuốc từ người khác.
            </p>
            <p>
              Tại Việt Nam, tỷ lệ hút thuốc ở nam giới vẫn ở mức cao đáng lo ngại. Không chỉ làm tăng gánh nặng y tế, hút thuốc còn là nguyên nhân chính của nhiều bệnh mạn tính như ung thư, tim mạch, phổi tắc nghẽn mãn tính (COPD), và nhiều vấn đề sinh sản, tâm thần khác.
            </p>
            <p>
              Cai thuốc lá không đơn giản là dừng lại việc hút một điếu thuốc. Nó là quá trình đầy thách thức, liên quan đến thay đổi hành vi, điều chỉnh tâm lý và giải quyết sự phụ thuộc thể chất vào nicotine. Tuy nhiên, với sự hỗ trợ đúng cách, sự quyết tâm và kiến thức đầy đủ, hành trình này hoàn toàn có thể thành công – mang lại lợi ích to lớn cho sức khỏe của bản thân và cộng đồng.
            </p>
          </div>
        </section>

        {/* Phần 2: Tác hại của thuốc lá */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-gray-400 border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-400 px-4 py-2 text-left">Bộ phận</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Tác hại</th>
              </tr>
            </thead>
            <tbody className="bg-white text-gray-700">
              <tr>
                <td className="border border-gray-400 px-4 py-3">Phổi</td>
                <td className="border border-gray-400 px-4 py-3">Ung thư phổi, viêm phế quản mãn tính, COPD</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-3">Tim mạch</td>
                <td className="border border-gray-400 px-4 py-3">Tăng huyết áp, xơ vữa động mạch, đột quỵ, nhồi máu cơ tim</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-3">Não bộ</td>
                <td className="border border-gray-400 px-4 py-3">Giảm trí nhớ, tăng căng thẳng, tăng nguy cơ đột quỵ</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-3">Da và răng</td>
                <td className="border border-gray-400 px-4 py-3">Lão hóa sớm, da xỉn màu, răng ố vàng, viêm nướu</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-3">Sinh sản</td>
                <td className="border border-gray-400 px-4 py-3">Giảm khả năng sinh sản, gây sẩy thai ở nữ</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-4 py-3">Hệ tiêu hóa</td>
                <td className="border border-gray-400 px-4 py-3">Viêm loét dạ dày, nguy cơ ung thư thực quản và tụy</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Phần 3: Thành phần độc hại */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>3. Thành phần độc hại trong thuốc lá</h2>
          <p className='text-lg mb-4'>
            Một điếu thuốc tưởng chừng nhỏ bé nhưng lại chứa hàng ngàn hóa chất độc hại. Trong đó có thể chia thành 4 nhóm chính:
          </p>
          <ul className='list-disc pl-6 space-y-2 text-lg'>
            <li>
              <strong>Oxyde carbon (CO):</strong> Gây cản trở vận chuyển oxy trong máu, làm giảm chức năng tim phổi. Ái lực của CO với hồng cầu gấp 210 lần oxy.
            </li>
            <li>
              <strong>Hắc ín (Tar):</strong> Gồm nhiều chất sinh ung thư như benzopyrene, chlorua vinyl, naphthalene.
            </li>
            <li>
              <strong>Chất kích thích:</strong> Như acrolein, aldehyde, phenol – gây kích ứng đường hô hấp và thúc đẩy các bệnh mạn tính.
            </li>
            <li>
              <strong>Nicotine:</strong> Chất gây nghiện mạnh, tác động lên hệ thần kinh trung ương, gây phụ thuộc thể chất và tinh thần.
            </li>
          </ul>
        </section>

        {/* Phần 4: Nicotine và cơ chế gây nghiện */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>4. Nicotine và cơ chế gây nghiện</h2>
          <div className='space-y-4 text-lg'>
            <p>
              Nicotine là thành phần chủ yếu khiến thuốc lá trở thành chất gây nghiện mạnh. Khi hút thuốc, nicotine nhanh chóng đi vào máu và tác động đến não chỉ sau vài giây. Nó kích thích tiết dopamine – chất dẫn truyền thần kinh tạo cảm giác khoái cảm, tập trung và thư giãn tạm thời.
            </p>
            <p>
              Tuy nhiên, khi tác dụng của nicotine giảm, người hút bắt đầu cảm thấy lo lắng, cáu gắt, mất tập trung. Điều này dẫn đến chu kỳ lệ thuộc: hút – cảm thấy ổn – ngừng hút – khó chịu – lại hút.
            </p>
            <p>
              Sự phụ thuộc này không chỉ là thể chất mà còn mang tính hành vi (quen tay, thói quen sau ăn, lúc căng thẳng...) và tâm lý (niềm tin rằng thuốc giúp thư giãn hoặc "xả stress").
            </p>
          </div>
        </section>

        {/* Phần 5: Dấu hiệu và triệu chứng */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>5. Dấu hiệu và triệu chứng của sự lệ thuộc</h2>
          <ul className='list-disc pl-6 space-y-2 text-lg'>
            <li>Cảm giác thèm thuốc mãnh liệt sau vài giờ không hút</li>
            <li>Cáu gắt, bồn chồn, dễ nóng giận</li>
            <li>Mất ngủ hoặc ngủ chập chờn</li>
            <li>Khó tập trung</li>
            <li>Có cảm giác "không thể làm việc nếu không hút thuốc"</li>
          </ul>
        </section>

        {/* Phần 6: Lợi ích khi bỏ thuốc */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>6. Lợi ích khi bỏ thuốc – từng mốc thời gian</h2>
          <div className='overflow-x-auto'>
            <table className="table-auto w-full border border-gray-400 border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-400 px-4 py-2 text-left">Thời gian</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">Lợi ích sức khỏe</th>
                </tr>
              </thead>
              <tbody className="bg-white text-gray-700">
                <tr>
                  <td className="border border-gray-400 px-4 py-3 font-medium">20 phút</td>
                  <td className="border border-gray-400 px-4 py-3">• Nhịp tim và huyết áp bắt đầu ổn định<br/>• Nhiệt độ tay chân trở về bình thường</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-3 font-medium">12–24 giờ</td>
                  <td className="border border-gray-400 px-4 py-3">• Hàm lượng CO trong máu giảm xuống mức bình thường<br/>• Khả năng hấp thu oxy tăng lên<br/>• Nguy cơ đau tim bắt đầu giảm</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-3 font-medium">2 tuần – 3 tháng</td>
                  <td className="border border-gray-400 px-4 py-3">• Tuần hoàn máu cải thiện đáng kể<br/>• Chức năng phổi tăng 30%<br/>• Vận động dễ dàng hơn</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-3 font-medium">1 – 9 tháng</td>
                  <td className="border border-gray-400 px-4 py-3">• Ho và khó thở giảm rõ rệt<br/>• Phổi tự làm sạch tốt hơn<br/>• Giảm nguy cơ nhiễm trùng</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-3 font-medium">1 năm</td>
                  <td className="border border-gray-400 px-4 py-3">• Nguy cơ bệnh tim mạch giảm 50%<br/>• Huyết áp và nhịp tim ổn định<br/>• Sức khỏe tổng thể cải thiện</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-3 font-medium">5 năm</td>
                  <td className="border border-gray-400 px-4 py-3">• Nguy cơ đột quỵ giảm đáng kể<br/>• Giảm nguy cơ ung thư miệng, cổ họng<br/>• Giảm nguy cơ ung thư thực quản</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-4 py-3 font-medium">10 – 15 năm</td>
                  <td className="border border-gray-400 px-4 py-3">• Nguy cơ ung thư phổi giảm 50%<br/>• Nguy cơ bệnh tim như người chưa hút<br/>• Tuổi thọ tăng lên đáng kể</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Phần 7: Phương pháp cai nghiện */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>7. Các phương pháp cai nghiện hiệu quả</h2>
          <div className='space-y-6'>
            <div>
              <h3 className='text-xl font-medium mb-3 text-gray-700'>1. Thay đổi hành vi</h3>
              <ul className='list-disc pl-6 space-y-2 text-lg'>
                <li>Xác định lý do muốn bỏ thuốc</li>
                <li>Lập kế hoạch cụ thể từng ngày</li>
                <li>Ghi lại thời điểm thường hút thuốc để tránh né</li>
                <li>Thay thế bằng hành vi tích cực (tập thể dục, uống nước, đi bộ…)</li>
              </ul>
            </div>

            <div>
              <h3 className='text-xl font-medium mb-3 text-gray-700'>2. Hỗ trợ y tế</h3>
              <ul className='list-disc pl-6 space-y-2 text-lg'>
                <li>Miếng dán hoặc kẹo nicotine (NRT)</li>
                <li>Thuốc điều trị như Bupropion (Zyban) hoặc Varenicline (Champix)</li>
                <li>Tư vấn từ bác sĩ chuyên khoa hoặc trung tâm y tế dự phòng</li>
              </ul>
            </div>

            <div>
              <h3 className='text-xl font-medium mb-3 text-gray-700'>3. Tư vấn tâm lý</h3>
              <ul className='list-disc pl-6 space-y-2 text-lg'>
                <li>Liệu pháp nhận thức – hành vi (CBT)</li>
                <li>Nhóm hỗ trợ cộng đồng, online/offline</li>
                <li>Hotline hỗ trợ hoặc ứng dụng cai thuốc (ví dụ: Smoke Free, QuitNow...)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Phần 8: Mẹo vượt qua cơn thèm thuốc */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>8. Mẹo vượt qua cơn thèm thuốc</h2>
          <div className='space-y-4'>
            <p className='text-lg'>Phương pháp 4D:</p>
            <ul className='list-disc pl-6 space-y-2 text-lg'>
              <li>Delay – Trì hoãn cơn thèm ít nhất 5–10 phút</li>
              <li>Deep Breath – Hít thở sâu</li>
              <li>Drink Water – Uống một ly nước mát</li>
              <li>Do Something Else – Làm điều gì đó khác như đi bộ, nghe nhạc</li>
            </ul>
            <p className='text-lg mt-4'>Các mẹo khác:</p>
            <ul className='list-disc pl-6 space-y-2 text-lg'>
              <li>Tránh môi trường hút thuốc (quán cà phê, nhậu…)</li>
              <li>Mang theo kẹo ngậm, chewing gum</li>
              <li>Giữ tay bận rộn (viết, chơi đồ chơi nhỏ…)</li>
            </ul>
          </div>
        </section>

        {/* Phần 9: Hiểu lầm thường gặp */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>9. Những hiểu lầm thường gặp</h2>
          <div className='overflow-x-auto'>
            <table className='w-full bg-white border border-gray-300'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='px-6 py-3 border-b text-left'>Hiểu lầm</th>
                  <th className='px-6 py-3 border-b text-left'>Sự thật</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='px-6 py-4 border-b'>"Cai thuốc là không thể"</td>
                  <td className='px-6 py-4 border-b'>Hoàn toàn có thể nếu có kế hoạch và hỗ trợ đúng</td>
                </tr>
                <tr>
                  <td className='px-6 py-4 border-b'>"Tôi còn trẻ, chưa cần bỏ thuốc"</td>
                  <td className='px-6 py-4 border-b'>Càng cai sớm, lợi ích càng lớn, phục hồi nhanh</td>
                </tr>
                <tr>
                  <td className='px-6 py-4 border-b'>"Hút thuốc lá điện tử an toàn hơn"</td>
                  <td className='px-6 py-4 border-b'>Sai – vẫn chứa nicotine và chất gây hại khác</td>
                </tr>
                <tr>
                  <td className='px-6 py-4 border-b'>"Một điếu mỗi ngày không sao cả"</td>
                  <td className='px-6 py-4 border-b'>Nguy cơ bệnh tim vẫn tăng, không có mức độ hút thuốc nào là an toàn</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Phần 10: Nguồn tham khảo */}
        <section>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>10. Nguồn tham khảo uy tín</h2>
          <ul className='list-disc pl-6 space-y-2 text-lg'>
            <li>Tổ chức Y tế Thế giới (WHO)</li>
            <li>CDC Hoa Kỳ – Centers for Disease Control and Prevention</li>
            <li>Bộ Y tế Việt Nam – Cục phòng chống tác hại thuốc lá</li>
            <li>Các nghiên cứu trên PubMed, The Lancet</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default KnowledgePage;
