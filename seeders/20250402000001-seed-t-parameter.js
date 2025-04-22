'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('t_parameter', [
      {
        user_id: 1, 
        about: `<p><strong>Selamat datang di<span style="color:#2E7D32; font-weight: bold;">Balige Bersih</span></strong>, aplikasi pelaporan masyarakat yang bertujuan untuk menjaga kebersihan dan kelestarian lingkungan di Kota Balige, khususnya di kawasan Kecamatan Balige, Kabupaten Toba. Aplikasi ini diciptakan sebagai solusi untuk mempermudah masyarakat dalam melaporkan isu sampah dan permasalahan lingkungan yang terjadi di sekitar mereka.</p> 
                <p><strong>Balige Bersih</strong> memberikan kemudahan bagi masyarakat untuk menyampaikan laporan secara langsung kepada Dinas Lingkungan Hidup Kabupaten Toba, yang akan segera menindaklanjuti laporan yang diterima. Dengan fitur yang praktis dan mudah digunakan, aplikasi ini menghubungkan warga dengan instansi yang berwenang dalam waktu singkat dan efektif. Setiap laporan yang masuk akan segera ditinjau oleh tim dari Dinas Lingkungan Hidup, yang bertugas untuk menjaga dan meningkatkan kualitas lingkungan di Balige.</p>
                <p>Dalam aplikasi ini, masyarakat dapat melaporkan berbagai jenis isu lingkungan, terutama masalah sampah, yang sering kali menjadi persoalan besar di kota-kota besar. Dengan adanya laporan yang terus-menerus masuk melalui aplikasi ini, Dinas Lingkungan Hidup dapat melakukan tindakan yang lebih cepat dan terkoordinasi dalam upaya pengelolaan sampah dan menjaga kebersihan lingkungan.</p>
                <p><strong>Fitur utama yang ditawarkan oleh Balige Bersih</strong> meliputi:
                    <ul>
                        <li><strong>Pencatatan Laporan Isu Sampah:</strong> Masyarakat dapat dengan mudah melaporkan adanya sampah yang berserakan di area publik, tempat wisata, ataupun lokasi lainnya yang dianggap perlu perhatian.</li>
                        <li><strong>Pelaporan Lokasi yang Akurat:</strong> Aplikasi ini memungkinkan pengguna untuk melampirkan foto dan keterangan lokasi yang terperinci, sehingga tim Dinas Lingkungan Hidup dapat segera menindaklanjuti laporan dengan tepat.</li>
                        <li><strong>Status Laporan:</strong> Setiap laporan yang dikirim akan mendapatkan status yang terupdate secara berkala, mulai dari "Diterima", "Dalam Proses", hingga "Tindakan Selesai".</li>
                        <li><strong>Notifikasi:</strong> Pengguna akan mendapatkan pemberitahuan mengenai perkembangan laporan mereka melalui aplikasi, memastikan mereka tetap terinformasi tentang status laporan yang dikirim.</li>
                    </ul>
                </p>
                <p>Kami percaya bahwa kebersihan adalah tanggung jawab bersama, dan melalui aplikasi <strong>Balige Bersih</strong>, kami berharap dapat menciptakan lingkungan yang lebih bersih, sehat, dan nyaman untuk kita semua. Aplikasi ini juga bertujuan untuk meningkatkan partisipasi aktif masyarakat dalam menjaga kelestarian alam dan kebersihan di sekitar mereka.</p>
                <p>Dengan aplikasi ini, setiap warga Balige memiliki kesempatan untuk turut serta dalam upaya besar menjaga kebersihan dan kelestarian lingkungan kita. Yuk, bergabung bersama kami untuk membuat Balige lebih bersih, lebih hijau, dan lebih nyaman untuk semua!</p>
                <p><strong>Balige Bersih</strong> - Ayo Laporkan Isu Sampah, Ciptakan Lingkungan yang Bersih!</p>`,
                terms: `<p>Dengan menggunakan aplikasi <strong>Balige Bersih</strong>, Anda menyetujui seluruh ketentuan layanan yang ditetapkan dan bertanggung jawab atas setiap laporan yang Anda kirimkan. Harap membaca dengan teliti dan memahami ketentuan ini sebelum mengajukan laporan mengenai masalah lingkungan di sekitar Anda. Ketentuan ini mencakup hak dan kewajiban Anda sebagai pengguna, serta bagaimana aplikasi ini dikelola dan digunakan oleh Dinas Lingkungan Hidup Kabupaten Toba.</p>

                <ul>
                    <li><strong>Penggunaan yang Sah:</strong> Anda hanya diperbolehkan menggunakan aplikasi <strong>Balige Bersih</strong> untuk tujuan pelaporan isu lingkungan yang berkaitan dengan masalah sampah dan kondisi lingkungan di sekitar Kota Balige, khususnya di wilayah Kecamatan Balige. Penggunaan aplikasi ini untuk tujuan lain yang tidak sesuai dengan fungsinya, seperti penyalahgunaan data atau aktivitas yang melanggar hukum, sangat dilarang.</li>
                    
                    <li><strong>Akuntabilitas Laporan:</strong> Anda bertanggung jawab penuh atas kebenaran dan keakuratan informasi yang Anda laporkan. Pastikan untuk menyampaikan laporan dengan deskripsi yang jelas, serta mencantumkan lokasi yang tepat agar dapat ditindaklanjuti dengan cepat. Laporan yang tidak lengkap atau tidak jelas dapat mengakibatkan penundaan dalam penanganan.</li>
                    
                    <li><strong>Penggunaan Foto:</strong> Anda diizinkan untuk melampirkan foto sebagai bukti dalam pelaporan Anda. Foto yang dikirimkan harus sesuai dengan peraturan yang berlaku dan tidak mengandung unsur yang melanggar hukum, menghina, atau tidak sopan. Pengguna dilarang mengunggah foto yang bersifat pribadi atau yang dapat mengganggu privasi pihak lain tanpa izin yang sah.</li>
                    
                    <li><strong>Perubahan Ketentuan:</strong> Dinas Lingkungan Hidup Kabupaten Toba berhak untuk mengubah atau memperbarui ketentuan layanan ini kapan saja tanpa pemberitahuan terlebih dahulu. Anda disarankan untuk secara berkala memeriksa pembaruan dalam ketentuan layanan ini agar tetap memahami hak dan kewajiban Anda saat menggunakan aplikasi <strong>Balige Bersih</strong>.</li>
                    
                    <li><strong>Keamanan dan Privasi:</strong> Data pribadi dan laporan yang Anda kirimkan melalui aplikasi ini akan diperlakukan dengan sangat hati-hati. Data tersebut hanya digunakan untuk tujuan pelaporan lingkungan dan tidak akan dibagikan kepada pihak ketiga tanpa izin eksplisit dari Anda. Kami berkomitmen untuk menjaga kerahasiaan data pribadi dan menghindari penyalahgunaan informasi yang Anda berikan.</li>
                
                    <li><strong>Proses Penanganan Laporan:</strong> Laporan yang Anda kirimkan akan diterima oleh Dinas Lingkungan Hidup Kabupaten Toba dan ditindaklanjuti sesuai dengan prosedur yang berlaku. Setiap laporan akan mendapat status yang jelas, mulai dari "Diterima", "Dalam Proses", hingga "Tindakan Selesai". Harap bersabar dalam menunggu respon atas laporan Anda.</li>
                
                    <li><strong>Larangan Penggunaan:</strong> Anda dilarang menggunakan aplikasi <strong>Balige Bersih</strong> untuk tujuan-tujuan yang bersifat ilegal, melanggar hak orang lain, atau merusak reputasi aplikasi dan pihak yang terkait. Penyalahgunaan aplikasi ini bisa mengakibatkan penangguhan atau pemblokiran akun Anda.</li>
                
                    <li><strong>Penolakan Tanggung Jawab:</strong> Dinas Lingkungan Hidup Kabupaten Toba tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul akibat kesalahan dalam pengisian laporan atau ketidakakuratan data yang diberikan oleh pengguna.</li>
                </ul>
                <p>Dengan menggunakan aplikasi ini, Anda menyetujui untuk mematuhi seluruh ketentuan yang ada dan bertanggung jawab atas laporan yang Anda buat. Kami berharap aplikasi ini dapat membantu Anda berkontribusi pada kebersihan dan kelestarian lingkungan di sekitar Anda. Terima kasih telah menggunakan aplikasi <strong>Balige Bersih</strong>.</p>`,
                report_guidelines: `<p>Pastikan laporan yang Anda kirimkan melalui aplikasi <strong>Balige Bersih</strong> lengkap dan sesuai dengan pedoman yang kami tetapkan. Laporan yang tidak lengkap atau tidak sesuai dengan pedoman akan ditunda hingga diperbaiki. Aplikasi ini bertujuan untuk meningkatkan kualitas pelaporan lingkungan, khususnya mengenai masalah sampah di Kota Balige. Oleh karena itu, pastikan laporan Anda jelas, akurat, dan dapat diproses dengan cepat oleh tim Dinas Lingkungan Hidup Kabupaten Toba.</p>

                <ul>
                    <li><strong>Lokasi Akurat:</strong> 
                        <p>Untuk memastikan laporan Anda dapat ditindaklanjuti dengan cepat, sangat penting untuk memberikan lokasi yang akurat. Anda dapat menggunakan fitur GPS pada perangkat Anda untuk menandai lokasi dengan tepat.</p>
                        <ul>
                            <li><strong>Jika Anda berada di lokasi (menggunakan GPS):</strong> Aktifkan fitur GPS pada perangkat Anda agar lokasi Anda dapat terdeteksi secara otomatis. Pastikan GPS berfungsi dengan baik dan lokasi yang terdeteksi sesuai dengan permasalahan yang Anda laporkan.</li>
                            <li><strong>Jika Anda tidak berada di lokasi:</strong> Anda masih dapat melaporkan masalah lingkungan dengan memberikan deskripsi lokasi yang jelas. Sertakan informasi tambahan seperti nama jalan, landmark (misalnya, taman, sekolah, atau gedung umum), atau titik referensi yang dapat memudahkan tim Dinas Lingkungan Hidup menemukan masalah yang Anda laporkan.</li>
                        </ul>
                    </li>
                
                    <li><strong>Deskripsi Laporan:</strong>
                        <p>Deskripsi yang jelas dan rinci akan sangat membantu tim Dinas Lingkungan Hidup dalam menilai dan menangani masalah yang Anda laporkan. Jelaskan masalah lingkungan yang terjadi dengan detail, termasuk jenis sampah atau permasalahan lingkungan yang dilaporkan.</p>
                        <ul>
                            <li>Jika Anda melaporkan sampah, sebutkan jenis sampah (plastik, organik, logam, dll.), serta jumlah atau ukuran tumpukan sampah tersebut.</li>
                            <li>Jelaskan apakah lokasi tersebut seringkali menjadi tempat pembuangan sampah, atau jika ada kondisi lain yang perlu diperhatikan (misalnya, sampah yang terbakar, tumpukan sampah yang mengganggu jalan, dll.).</li>
                            <li>Informasikan juga jika ada bahaya atau potensi masalah lain yang timbul akibat sampah tersebut (misalnya, pencemaran air, bau tidak sedap, atau gangguan kesehatan). Hal ini akan membantu penanganan yang lebih cepat dan tepat.</li>
                        </ul>
                    </li>
                
                    <li><strong>Foto dan Bukti:</strong>
                        <p>Foto yang jelas dan relevan akan sangat membantu dalam mendokumentasikan masalah yang Anda laporkan. Pastikan foto yang Anda lampirkan menggambarkan dengan jelas kondisi lokasi dan masalah lingkungan yang Anda laporkan.</p>
                        <ul>
                            <li><strong>Foto yang jelas:</strong> Pastikan foto yang Anda unggah memiliki kualitas yang baik dan cukup terang untuk memperlihatkan dengan jelas kondisi lokasi dan sampah atau masalah lingkungan yang Anda laporkan.</li>
                            <li><strong>Perhatikan kebersihan saat mengambil foto:</strong> Jangan mengambil foto yang mengandung unsur yang tidak sesuai atau melanggar norma kesopanan. Jaga privasi individu lain yang mungkin ada di lokasi.</li>
                            <li><strong>Jumlah Foto:</strong> Anda bisa mengunggah beberapa foto jika diperlukan untuk memperlihatkan seluruh permasalahan. Pastikan setiap foto mendukung laporan Anda dan menunjukkan berbagai sudut masalah yang terjadi.</li>
                            <li><strong>Format Foto:</strong> Pastikan foto yang Anda unggah dalam format yang umum (JPG, PNG) dan memiliki ukuran yang tidak terlalu besar agar memudahkan proses pengunggahan.</li>
                        </ul>
                    </li>
                
                    <li><strong>Informasi Lain:</strong> 
                        <p>Jika ada informasi tambahan yang perlu diperhatikan oleh tim Dinas Lingkungan Hidup, seperti potensi dampak terhadap kesehatan atau lingkungan, pastikan untuk menyertakannya dalam laporan. Hal ini akan membantu pihak berwenang untuk lebih memahami urgensi laporan Anda.</p>
                    </li>
                </ul>
                
                <p><strong>Balige Bersih</strong> mengharapkan kerja sama yang baik dari masyarakat untuk menjaga kebersihan dan kelestarian lingkungan Kota Balige. Dengan mengikuti pedoman ini, Anda membantu Dinas Lingkungan Hidup dalam menanggapi masalah lingkungan dengan cepat dan tepat. Terima kasih telah berpartisipasi dalam menjaga kebersihan lingkungan sekitar Anda.</p>`,                
        emergency_contact: "113",
        ambulance_contact: "118",
        police_contact: "110",
        firefighter_contact: "113",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('t_parameter', null, {});
  }
};
