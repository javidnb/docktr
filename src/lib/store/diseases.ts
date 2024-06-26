export const diseases = [
	{
		id: 1,
		name: 'Dermatologiya',
		slug: 'dermatologiya',
		conditions: {
			Ekzema: [
				'Dəri qaşınması',
				'Qızartı və səpgi',
				'Dəri quruluğu',
				'Dəri çatlaqları',
				'Dərinin soyulması'
			],
			Psoriaz: ['Dəri quruluğu', 'Dəri tökülməsi', 'Qızartı və qabarıqlıq', 'Ağrı və qaşıntı'],
			Akne: [
				'Sızanaqlar',
				'Dəridə ləkələr',
				'Dərinin yağlanması',
				'İrinli sızanaqlar',
				'Dəri gözenəklərinin genişlənməsi',
				'Ağrı və qaşıntı'
			],
			'Dəri Infeksiyaları': [
				'Açıq yaralar',
				'Dərinin irinləməsi',
				'Qızartı və şişkinlik',
				'Suluqlu yaralar',
				'Dərinin soyulması'
			],
			'Allergik Reaksiyalar': [
				'Dəri kabarması',
				'Qaşınma',
				'Qızartı və səpgi',
				'Dərinin şişməsi',
				'Ürtiker (kəskin allergik reaksiya)'
			],
			'Göz altı qaraltılar': ['Dərinin rəngsizləşməsi', 'Göz altı qaraltılar', 'Yorğun görünüş'],
			'Dırnaq Problemləri': [
				'Dırnaq dəyişiklikləri',
				'Dırnaq batması',
				'Dırnaq qırılması',
				'Dırnaqlarda ləkələr',
				'Dırnaq infeksiyaları'
			],
			'Dəri Rəng Dəyişiklikləri': [
				'Dəridə rəng dəyişiklikləri',
				'Vitiliqo',
				'Hiperpigmentasiya',
				'Hipoigmentasiya',
				'Qara nöqtələr'
			],
			'Saç və Dəri Problemləri': [
				'Saç tökülməsi',
				'Kəpək',
				'Saç dərisinin qaşınması',
				'Saçların nazikləşməsi',
				'Alopecia (keçəl)'
			],
			'Dərinin Qalınlaşması': [
				'Dərinin qalınlaşması',
				'Dərinin kobudlaşması',
				'Dərinin sərtləşməsi',
				'Dərinin şişməsi'
			],
			'Yanma və İltihab': [
				'Yanma hissi',
				'Dərinin qızarması',
				'Dəri iltihabı',
				'Dərinin həssaslığı'
			],
			'Digər Dəri Problemləri': [
				'Köpüklü yaralar',
				'Dərinin çatlaması',
				'Dərinin incəlməsi',
				'Dərinin sızması',
				'Çibanlar'
			]
		}
	},
	{
		id: 2,
		name: 'Psixiatriya',
		slug: 'psixiatriya',
		conditions: {
			Depressiya: [
				'Davamlı kədər halı',
				'Marağın və zövqün itirilməsi',
				'Yorğunluq və enerji itkisi',
				'Yuxu problemləri',
				'İştah dəyişiklikləri',
				'Odaklanma və qərar vermə zorlukları',
				'İntihar düşüncələri'
			],
			'Anksiyete Bozuklukları': [
				'Həddindən artıq narahatlıq və qorxu',
				'Panik ataklar',
				'Əzələ gərginliyi',
				'Hızlı kalp atışı',
				'Terleme',
				'Yuxu problemləri',
				'Diqqəti toplama çətinlikləri'
			],
			'Bipolyar Bozukluk': [
				'Manik və depressiv ataklar',
				'Həddindən artıq şənlik və ya əsəbilik',
				'Artan enerji və fəaliyyət səviyyəsi',
				'Azalan uyku ihtiyacı',
				'İrritabilik',
				'Qərar vermə və düşüncə sürətində dəyişikliklər'
			],
			Şizofreniya: [
				'Halüsinasyonlar',
				'Sanrılar',
				'Düşüncə bozuklukları',
				'Sosial geri çəkilmə',
				'Motivasiya itkisi',
				'Duygusal ifadesizlik'
			],
			'Obsesif-Kompulsif Bozukluk (OKB)': [
				'Təkrarlanan, istənilməyən düşüncələr (obsesiyalar)',
				'Zorlayıcı, təkrarlanan davranışlar (kompulsiyalar)',
				'Narahatlıq və sıkıntı hissi'
			],
			'Travma Sonrası Stress Bozukluğu (TSSB)': [
				'Travmatik hadisələrin təkrar-təkrar yaşanması (flashback)',
				'Kabuslar',
				'Həddindən artıq uyarılma və tetikte olma',
				'Sosial geri çəkilmə',
				'Yuxu problemləri'
			],
			'Yeme Bozuklukları': [
				'Anoreksiya nervoza',
				'Bulimiya nervoza',
				'Həddindən artıq yemək bozukluğu',
				'Bədən dismorfik bozukluğu'
			],
			'Diqqət Əskikliyi və Hiperaktivite Bozukluğu (DEHB)': [
				'Diqqət dağınıqlığı',
				'Hiperaktivite',
				'Dürtüsellik',
				'Organizasyon və planlama çətinlikləri'
			],
			'Bağımlılık Bozuklukları': [
				'Maddə bağımlılığı',
				'Alkol bağımlılığı',
				'Kumar bağımlılığı',
				'İnternet və oyun bağımlılığı'
			],
			'Diğer Psikolojik Bozukluklar': [
				'Kədər və ümidsizlik',
				'Günahkarlıq və utanc',
				'Düşük özünəinam',
				'Sosial geri çəkilmə',
				'İrrasional düşüncələr',
				'Paranoia və şübhələr',
				'Özünə zərər vermə',
				'Realite itkisi və halüsinasiyalar'
			]
		}
	},
	{
		id: 3,
		name: 'Qidalanma və diyet',
		slug: 'qidalanma-ve-diyet',
		conditions: {
			İştahsızlık: ['İştahsızlıq', 'Yeməkdən sonra doyma hissi', 'Çəki itkisi'],
			'Həddindən Artıq Yemək': ['Həddindən artıq yemək', 'Çəki artımı', 'Yemək sonrası narahatlıq'],
			'Qəbizlik və İshal': ['Qəbizlik', 'İshal', 'Qarın ağrısı', 'Şişkinlik'],
			'Vitamin və Mineral Əskikliyi': [
				'Vitamin əskikliyi',
				'Dəmir əskikliyi',
				'Kalsium əskikliyi',
				'Enerji səviyyəsinin aşağı olması',
				'Ağrı və qaşıntı'
			],
			'Qida Alerjiləri və İntoleransı': [
				'Qida alerjiləri',
				'Qida intoleransı',
				'Dəridə səpgi və ya qızartı',
				'Qarın ağrısı'
			],
			'Həzm Problemləri': [
				'Həzmsizlik',
				'Bağırsaq hərəkətlərində dəyişiklik',
				'Mədə qıcqırması',
				'Köp'
			],
			'Yuxu Problemləri': ['Yuxusuzluq', 'Yeməkdən sonra yuxululuq', 'Həddindən artıq yuxu istəyi'],
			'Enerji Azlığı': [
				'Yorğunluq',
				'Enerji səviyyəsinin aşağı olması',
				'Fiziki və zehni yorğunluq'
			],
			'Çəki İdarə Problemləri': [
				'Çəki itkisi',
				'Çəki artımı',
				'Düzgün pəhriz saxlama çətinlikləri'
			],
			'Metabolik Bozukluklar': [
				'Diabet simptomları',
				'Hipoqlikemiya (qan şəkərinin düşməsi)',
				'Qan təzyiqində dəyişikliklər'
			],
			'Dəri Problemləri': [
				'Dəri problemləri (sızanaq, qızartı)',
				'Saç və dırnaq problemləri',
				'Dərinin quru və ya yağlı olması'
			],
			'Psixoloji və Davranış Dəyişiklikləri': [
				'Əhval dəyişikliyi',
				'Günahkarlıq və utanc hissi',
				'Stress və narahatlıq',
				'Depressiya'
			]
		}
	},
	{
		id: 4,
		name: 'Psixologiya',
		slug: 'psixologiya',
		conditions: {
			Depressiya: [
				'Davamlı kədər halı',
				'Marağın və zövqün itirilməsi',
				'Yorğunluq və enerji itkisi',
				'Yuxu problemləri',
				'İştah dəyişiklikləri',
				'Diqqəti toplama və qərar vermə zorlukları',
				'İntihar düşüncələri'
			],
			'Anksiyete Bozuklukları': [
				'Həddindən artıq narahatlıq və qorxu',
				'Panik ataklar',
				'Əzələ gərginliyi',
				'Hızlı kalp atışı',
				'Terleme',
				'Yuxu problemləri',
				'Diqqəti toplama çətinlikləri'
			],
			'Bipolyar Bozukluk': [
				'Manik və depressiv ataklar',
				'Həddindən artıq şənlik və ya əsəbilik',
				'Artan enerji və fəaliyyət səviyyəsi',
				'Azalan uyku ihtiyacı',
				'İrritabilik',
				'Qərar vermə və düşüncə sürətində dəyişikliklər'
			],
			Şizofreniya: [
				'Halüsinasyonlar',
				'Sanrılar',
				'Düşüncə bozuklukları',
				'Sosial geri çəkilmə',
				'Motivasiya itkisi',
				'Duygusal ifadesizlik'
			],
			'Obsesif-Kompulsif Bozukluk (OKB)': [
				'Təkrarlanan, istənilməyən düşüncələr (obsesiyalar)',
				'Zorlayıcı, təkrarlanan davranışlar (kompulsiyalar)',
				'Narahatlıq və sıkıntı hissi'
			],
			'Travma Sonrası Stress Bozukluğu (TSSB)': [
				'Travmatik hadisələrin təkrar-təkrar yaşanması (flashback)',
				'Kabuslar',
				'Həddindən artıq uyarılma və tetikte olma',
				'Sosial geri çəkilmə',
				'Yuxu problemləri'
			],
			'Yeme Bozuklukları': [
				'Anoreksiya nervoza',
				'Bulimiya nervoza',
				'Həddindən artıq yemək bozukluğu',
				'Bədən dismorfik bozukluğu'
			],
			'Diqqət Əskikliyi və Hiperaktivite Bozukluğu (DEHB)': [
				'Diqqət dağınıqlığı',
				'Hiperaktivite',
				'Dürtüsellik',
				'Organizasyon və planlama çətinlikləri'
			],
			'Bağımlılık Bozuklukları': [
				'Maddə bağımlılığı',
				'Alkol bağımlılığı',
				'Kumar bağımlılığı',
				'İnternet və oyun bağımlılığı'
			],
			'Digər Psikoloji Bozukluklar': [
				'Kədər və ümidsizlik',
				'Günahkarlıq və utanc',
				'Düşük özünəinam',
				'Sosial geri çəkilmə',
				'İrrasional düşüncələr',
				'Paranoia və şübhələr',
				'Özünə zərər vermə',
				'Realite itkisi və halüsinasiyalar',
				'Konsentrasiya çətinliyi',
				'Yaddaş problemləri',
				'Əhval dəyişikliyi',
				'Yuxusuzluq və ya həddindən artıq yuxululuq'
			]
		}
	},
	{
		id: 5,
		name: 'Pediatriya',
		slug: 'pediatriya',
		conditions: {
			'Soğuk Algınlığı': [
				'Burun axması',
				'Öskürək',
				'Boğaz ağrısı',
				'Yüksək hərarət',
				'Baş ağrısı'
			],
			'Grip (İnfluenza)': [
				'Yüksək hərarət',
				'Titreme',
				'Öskürək',
				'Boğaz ağrısı',
				'Baş ağrısı',
				'Əzələ ağrıları',
				'Yorğunluq'
			],
			Bronşit: [
				'Davamlı öskürək',
				'Nəfəs darlığı',
				'Hırıltılı tənəffüs',
				'Balgam ifrazı',
				'Yüksək hərarət'
			],
			Astma: ['Nəfəs darlığı', 'Hırıltılı tənəffüs', 'Gecə öskürəyi', 'Sinə sıxılması'],
			Pnevmoniya: [
				'Yüksək hərarət',
				'Titreme',
				'Öskürək ilə balgam',
				'Sinə ağrısı',
				'Nəfəs darlığı'
			],
			'Otit (Qulaq İltihabı)': [
				'Qulaq ağrısı',
				'Qulaqdan axıntı',
				'Yüksək hərarət',
				'Görmədə problem',
				'Qulaqda dolğunluq hissi'
			],
			Gastroenterit: ['İshal', 'Qusma', 'Qarın ağrısı', 'Yüksək hərarət', 'Susuzluq'],
			'Boğaz İltihabı': [
				'Boğaz ağrısı',
				'Boğazda qızartı',
				'Yüksək hərarət',
				'Udma çətinliyi',
				'Baş ağrısı'
			],
			'Dəri Döküntüləri': [
				'Dəri səpgi',
				'Qaşınma',
				'Qızartı',
				'Dəri qabarıqları',
				'Dəri tökülməsi'
			],
			Kızamık: ['Dəri səpgi', 'Yüksək hərarət', 'Öskürək', 'Burun axması', 'Göz qızartısı'],
			Kabakulak: [
				'Yanaqlarda şişlik',
				'Yüksək hərarət',
				'Baş ağrısı',
				'Yorğunluq',
				'Əzələ ağrıları'
			],
			'Su Çiçeği': ['Dəri səpgi', 'Qaşınma', 'Yüksək hərarət', 'Baş ağrısı', 'Yorğunluq'],
			Anemiya: ['Halsızlıq', 'Yorğunluq', 'Solğun dəri', 'Yüksək nəbz', 'Baş ağrısı'],
			Diabet: [
				'Tez-tez sidiyə çıxma',
				'Tez-tez susuzluq',
				'Qəfil kilo itkisi',
				'Yorğunluq',
				'Bulantı və qusma'
			],
			'İnkişaf Geriliyi': [
				'Fiziki inkişafda ləngimə',
				'Motor bacarıqlarında problemlər',
				'Dil inkişafında gecikmə',
				'Sosial və emosional problemlər'
			],
			Alerji: ['Qaşınma', 'Dəri səpgi', 'Nəfəs darlığı', 'Göz qızartısı', 'Asqırma'],
			'Uşaqlıq Dövrü Qəbizlik': [
				'Nadir və ya sərt nəcisləmə',
				'Qarın ağrısı',
				'Nəcisləmə zamanı ağrı',
				'Nəcisdə qan'
			],
			'İdrar Yolu İnfeksiyaları': [
				'Ağrılı idrar',
				'Tez-tez sidiyə çıxma',
				'Qarın ağrısı',
				'Yüksək hərarət',
				'Qanlı idrar'
			],
			'Kawasaki Xəstəliyi': [
				'Yüksək hərarət',
				'Boğazda və dildə qızartı',
				'Dəri səpgi',
				'Şişmiş limfa düyünləri',
				'Əllərdə və ayaqlarda şişlik'
			],
			'Revmatoid Artrit': [
				'Oynaq ağrısı',
				'Oynaq şişkinliyi',
				'Səhər sərtliyi',
				'Yüksək hərarət',
				'Yorğunluq'
			]
		}
	},
	{
		id: 6,
		name: 'Daxili xəstəliklər',
		slug: 'daxili-xestelikler',
		conditions: {
			'Yüksək Hərarət': ['Yüksək hərarət', 'Qızdırma'],
			Ağrı: ['Qarın ağrısı', 'Sinə ağrısı', 'Bel ağrısı', 'Baş ağrısı', 'Əzələ ağrısı'],
			Yorğunluq: ['Yorğunluq', 'Enerji itkisi', 'Fiziki zəiflik'],
			'Nəfəs Alma Çətinliyi': ['Nəfəs darlığı', 'Tez yorulma', 'Öskürək'],
			'Mədə-Bağırsaq Problemləri': [
				'Bulantı',
				'Qusma',
				'İshal',
				'Qəbizlik',
				'Qarın ağrısı',
				'Şişkinlik',
				'Mədə yanması',
				'Həzmsizlik',
				'Bağırsaq hərəkətlərində dəyişiklik'
			],
			'Dəri Problemləri': [
				'Dəri səpgiləri',
				'Qızartı',
				'Qaşınma',
				'Dərinin rəng dəyişiklikləri',
				'Dərinin soyulması'
			],
			'Ürək Problemləri': [
				'Sürətli ürək döyüntüsü',
				'Ürək çırpıntısı',
				'Sinə ağrısı',
				'Yüksək qan təzyiqi',
				'Aşağı qan təzyiqi'
			],
			'Diaqnostik Problemlər': [
				'Yaddaş itkisi',
				'Konsentrasiya çətinliyi',
				'İrritabilik',
				'Yuxu problemləri',
				'Əhval dəyişikliyi'
			],
			'Metabolik Bozukluklar': [
				'Diyabet simptomları',
				'Hipoqlikemiya (qan şəkərinin düşməsi)',
				'Qan təzyiqində dəyişikliklər'
			],
			'Hormon Problemləri': [
				'Tiroid problemi',
				'Hormon balanssızlığı',
				'Çəki artımı və ya azalması'
			],
			'İmmunitet Sistemi Problemləri': [
				'Tez-tez infeksiyalar',
				'Aşağı immunitet',
				'Uzun müddət sağalmayan yaralar'
			],
			Anemiya: ['Dəmir əskikliyi', 'Yorğunluq', 'Başgicəllənmə', 'Sürekli yuxululuq'],
			'Dəri Rəng Dəyişiklikləri': ['Dərinin saralması', 'Dərinin qaralması', 'Göz altı qaraltılar'],
			'Digər Problemlər': [
				'Başgicəllənmə',
				'Bayılma',
				'Qanama',
				'Sidikdə qan',
				'İdrar problemləri',
				'Bədəndə su tutma',
				'İştahsızlıq',
				'Artan susuzluq'
			]
		}
	},
	{
		id: 7,
		name: 'Kadın hastalıkları ve doğum',
		slug: 'kadin-hastaliklari-ve-dogum',
		conditions: {
			'Menstrual Problemler': [
				'Ağır və ya nizamsız menstrual qanaxmalar',
				'Menstrual dövründə güclü ağrı',
				'Premenstrüel sindrom (PMS)'
			],
			'Menopoz Simptomları': [
				'İstilik basması',
				'Gecə tərləmələri',
				'Vaginal quruluq',
				'Yuxu problemləri'
			],
			'Hamiləlik Problemləri': [
				'Bulantı və qusma',
				'Yuxu problemləri',
				'Şişkinlik və ayaq şişməsi',
				'Qarın ağrısı',
				'Baş ağrısı',
				'Artan susuzluq'
			],
			'Ginekoloji Infeksiyalar': [
				'Vaginal qaşınma',
				'Yanma hissi',
				'Vaginal axıntı',
				'Pelvik ağrı'
			],
			'Cinsi Sağlamlıq Problemləri': [
				'Cinsi əlaqə zamanı ağrı',
				'Vaginal quruluq',
				'Libido itkisi',
				'Orgazm problemi'
			],
			'Hamiləlik və Doğum Komplikasiyaları': [
				'Erkən doğum əlamətləri',
				'Amniotik maye sızması',
				'Yüksək qan təzyiqi',
				'Gestasyonel diabet',
				'Qanama',
				'Ağrı və ya kramplar'
			],
			'Doğum Sonrası Problemlər': [
				'Postpartum depressiya',
				'Lohusalıq dövründə infeksiyalar',
				'Süd vəzilərində ağrı',
				'Emzirmə problemləri',
				'Doğumdan sonra güclü qanaxma'
			],
			'Yumurtalıq Problemləri': [
				'Polikistik over sindromu (PCOS)',
				'Yumurtalıq kistləri',
				'Pelvik ağrı',
				'Menstrual dövründə düzensizlik'
			],
			'Uşaqlıq Problemləri': [
				'Endometrioz',
				'Uşaqlıq miomları',
				'Pelvik ağrı',
				'Ağır menstrual qanaxma'
			],
			'Digər Problemlər': [
				'Saç tökülməsi',
				'Dırnaq və dəri problemləri',
				'Ağrı və şişkinlik',
				'Halsızlıq və yorğunluq',
				'Qanama və ya çürüklər',
				'Dərinin rəngsizləşməsi'
			]
		}
	},
	{
		id: 8,
		name: 'Nöroloji',
		slug: 'noroloji',
		conditions: {
			'Baş Ağrısı': ['Baş ağrısı', 'Migren', 'Başgicəllənmə', 'Küme baş ağrıları'],
			'Yaddaş Problemləri': [
				'Yaddaş itkisi',
				'Diqqəti toplama çətinliyi',
				'Unutqanlıq',
				'Kognitiv disfunksiya'
			],
			'Qıcolmalar və Epilepsiya': [
				'Qıcolmalar',
				'Epileptik tutmalar',
				'Ani titrəmələr',
				'Bilinç itirilməsi'
			],
			'Hərəkət Bozuklukları': [
				'Titrəmə',
				'Parkinson simptomları',
				'Əzələ spazmı',
				'Hərəkət zamanı ağrı'
			],
			'Sinir Sistemi Problemləri': [
				'Əzələ zəifliyi',
				'Əl və ayaqlarda uyuşma',
				'Karıncalanma',
				'Neyropatiya'
			],
			'Görmə Problemləri': ['Görmə itkisi', 'İki görmə', 'Göz ağrısı', 'Gözlərin kontrol itkisi'],
			'Eşitmə Problemləri': ['Eşitmə itkisi', 'Qulaq cingildəməsi', 'Denge itkisi'],
			'Uşaqlıq Problemləri': ['Serebral palsi', 'Uşaq epilepsiyası', 'Uşaq davranış problemləri'],
			'Hissiyat Bozuklukları': [
				'Hissiyat itkisi',
				'Səsə və işığa həssaslıq',
				'Yanma və batma hissi'
			],
			'Yuxu Bozuklukları': ['Yuxusuzluq', 'Həddindən artıq yuxululuq', 'Yuxu sırasında narahatlıq'],
			'Başgicəllənmə və Denge Problemləri': [
				'Başgicəllənmə',
				'Denge itkisi',
				'Bayılma',
				'Hərəkət zamanı denge pozulması'
			],
			'İnme və Beyin Damar Problemləri': [
				'İnme simptomları',
				'Beyin travmaları sonrası simptomlar',
				'Tromboz',
				'Beyin damarlarının daralması'
			],
			'Multipl Skleroz (MS)': [
				'Həddindən artıq yorğunluq',
				'Görmə problemləri',
				'Denge və koordinasiya çətinlikləri',
				'Əzələ zəifliyi'
			],
			'Alzheimer və Demans': [
				'Yaddaş itkisi',
				'Davranış dəyişiklikləri',
				'Gündəlik işlərdə çətinlik',
				'Kognitiv disfunksiya'
			],
			'Migren və Baş Ağrısı Bozuklukları': [
				'Şiddətli baş ağrısı',
				'İşığa və səsə həssaslıq',
				'Bulantı və qusma',
				'Ağrı öncəsi aurası'
			],
			'Beyin Şişləri': [
				'Baş ağrısı',
				'Görmə və eşitmə problemləri',
				'Denge və koordinasiya çətinlikləri',
				'Qıcolmalar'
			],
			'Nörodegenerativ Bozukluklar': [
				'Parkinson simptomları',
				'Amyotrofik lateral skleroz (ALS)',
				'Hareket və koordinasiya çətinlikləri',
				'Əzələ zəifliyi və atrofisi'
			]
		}
	},
	{
		id: 9,
		name: 'Ortopedi ve travmatoloji',
		slug: 'ortopedi-ve-travmatoloji',
		conditions: {
			'Sümük Ağrısı': ['Sümük ağrısı', 'Qırıq sümüklər', 'Sümükdə çat', 'Sümük deformitələri'],
			'Əzələ Ağrısı': ['Əzələ ağrısı', 'Əzələ yırtılması', 'Əzələ zəifliyi', 'Əzələ spazmı'],
			'Oynaqlarda Ağrı': [
				'Oynaqlarda ağrı',
				'Oynaq şişkinliyi',
				'Oynaq tutukluğu',
				'Artrit simptomları'
			],
			'Hərəkət Məhdudiyyəti': [
				'Hərəkət məhdudiyyəti',
				'Hərəkət zamanı ağrı',
				'Denge və koordinasiya çətinlikləri'
			],
			'Travmatik Yaralanmalar': [
				'Burxulma',
				'Çıxıqlar',
				'Yaralanmalar sonrası ağrı',
				'Sümük infeksiyaları'
			],
			'Diz Problemləri': ['Diz ağrısı', 'Dizdə şişkinlik', 'Diz çıxığı', 'Menisk yırtığı'],
			'Bud və Kalça Problemləri': [
				'Bud ağrısı',
				'Kalça ağrısı',
				'Kalça çıxığı',
				'Kalça protezi problemləri'
			],
			'Çiyin və Bilək Problemləri': [
				'Çiyin ağrısı',
				'Çiyin çıxığı',
				'Bilək ağrısı',
				'Bilək burxulması'
			],
			'Ayaq və Ayaq Biləyi Problemləri': [
				'Topuq ağrısı',
				'Ayaq ağrısı',
				'Düz tabanlılıq',
				'Ayaq çıxığı'
			],
			'Sırt və Boyun Ağrısı': ['Sırt ağrısı', 'Boyun ağrısı', 'Disk yırtığı', 'Skolyoz'],
			'Kıkırdak Problemleri': ['Kıkırdak zədələnməsi', 'Kıkırdak aşınması', 'Kıkırdak ağrısı'],
			Osteoporoz: ['Sümük zəifliyi', 'Qırıq riski', 'Sümük itkisi', 'Osteoporoz ağrısı'],
			Deformitələr: ['Sümük deformitələri', 'Oynaq deformitələri', 'Bunyonlar', 'Çekiç barmağı'],
			'İltihab və Şişkinlik': ['Oynaq iltihabı', 'Şişkinlik', 'İltihablı artrit', 'Bursit'],
			Rehabilitasiya: [
				'Yaralanmalar sonrası reabilitasiya',
				'Fiziki terapiya',
				'Əzələ gücləndirmə',
				'Oynaq hərəkətlilik məşqləri'
			]
		}
	},
	{
		id: 10,
		name: 'Kulak burun boğaz hastalıkları',
		slug: 'kulak-burun-bogaz',
		conditions: {
			'Qulaq Problemləri': [
				'Qulaq ağrısı',
				'Eşitmə itkisi',
				'Qulaq cingildəməsi',
				'Qulaqda ifrazat',
				'Qulaq infeksiyaları',
				'Vertigo (başgicəllənmə)',
				'Kulak tıkanıklığı'
			],
			'Burun Problemləri': [
				'Burun tıkanıklığı',
				'Burun axması',
				'Sinüzit',
				'Burun qanaması',
				'Allergik rinit',
				'Koku itkisi',
				'Burunda poliplər'
			],
			'Boğaz Problemləri': [
				'Boğaz ağrısı',
				'Boğazda qıcıqlanma',
				'Səs itkisi',
				'Tonsillit (badamcıq iltihabı)',
				'Farengit',
				'Yutma çətinliyi',
				'Boğazda quruluq'
			],
			'Baş Ağrısı': ['Baş ağrısı', 'Migren', 'Sinüzitə bağlı baş ağrısı'],
			'Boyun Problemləri': [
				'Boyun ağrısı',
				'Boyun şişkinliyi',
				'Lenfadenit (lenf düyünü iltihabı)'
			],
			'Allergik Reaksiyalar': [
				'Burun axması',
				'Asqırma',
				'Qaşınma',
				'Göz qızartısı və sulanması',
				'Allergik rinit'
			],
			'Yuxu Apnesi və Xorlama': [
				'Gecə nəfəsin dayanması',
				'Yuxu apnesi',
				'Xorlama',
				'Yuxu zamanı boğulma hissi'
			],
			'Tənəffüs Problemləri': ['Nəfəs alma çətinliyi', 'Nəfəs darlığı', 'Astma simptomları'],
			'Səs Problemləri': ['Səsin xırıldaması', 'Səsin dəyişməsi', 'Səs itkisi'],
			'Göz Problemləri': ['Göz ağrısı', 'Göz infeksiyaları', 'Göz qızartısı', 'Göz yaşı axması'],
			İnfeksiyalar: [
				'Üst tənəffüs yolu infeksiyaları',
				'Boğaz infeksiyaları',
				'Qulaq infeksiyaları',
				'Burun infeksiyaları'
			],
			'Bademcik Problemleri': [
				'Tonsillit (badamcıq iltihabı)',
				'Bademciklerin şişmesi',
				'Boğazda ağrı',
				'Yutma çətinliyi'
			],
			'Gırtlak Problemleri': ['Laringit', 'Gırtlakta ağrı', 'Səsdə xırıldama', 'Səs itkisi'],
			'Baş ve Boyun Tümörleri': [
				'Baş və boyun şişləri',
				'Boğazda kütlə',
				'Səsdə dəyişiklik',
				'Udma çətinliyi'
			]
		}
	},
	{
		id: 11,
		name: 'Üroloji',
		slug: 'uroloji',
		conditions: {
			'İdrar Problemləri': [
				'Tez-tez idrara çıxma',
				'Gecə idrara çıxma',
				'Ağrılı idrar',
				'İdrar edərkən yanma',
				'İdrar tutmama',
				'İdrar axınında zəiflik'
			],
			'Böyrək Problemləri': [
				'Böyrək ağrısı',
				'Böyrək daşları',
				'Böyrək infeksiyaları',
				'Böyrək çatışmazlığı',
				'Böyrək şişləri'
			],
			'Prostat Problemləri': [
				'Prostat böyüməsi',
				'Prostat ağrısı',
				'Prostat infeksiyaları',
				'Prostat xərçəngi'
			],
			'Mesane Problemleri': [
				'Mesane ağrısı',
				'Mesane infeksiyaları',
				'Mesane daşları',
				'Ağrılı mesane sindromu',
				'Mesane şişləri'
			],
			'Sidik Yolu İnfeksiyaları': [
				'Ağrılı idrar',
				'Tez-tez idrara çıxma',
				'İdrarda qan',
				'Yanma hissi',
				'Alt qarın ağrısı'
			],
			'Cinsi Funksiya Bozuklukları': [
				'Erektil disfunksiya',
				'Azalmış cinsi istək',
				'Ağrılı cinsi əlaqə',
				'Ejakulasiya problemləri'
			],
			'Testis və Skrotum Problemləri': [
				'Testis ağrısı',
				'Testis şişməsi',
				'Varikosel',
				'Hidrosel',
				'Testis xərçəngi'
			],
			İnfertilite: ['Kısırlıq', 'Sperma sayının azlığı', 'Sperma keyfiyyətində problem'],
			'İnkontinans (İdrar Tutmama)': [
				'Tez-tez idrara çıxma',
				'İdrar tutmama',
				'Gecə idrara çıxma',
				'İdrar axınında zəiflik'
			],
			'Penis Problemləri': [
				'Penis ağrısı',
				'Penisde deformasiya',
				'Priapizm (uzun müddətli ereksiya)',
				'Peyronie xəstəliyi'
			]
		}
	},
	{
		id: 12,
		name: 'Genel cerrahi',
		slug: 'genel-cerrahi',
		conditions: {
			'Qarın Problemləri': [
				'Qarın ağrısı',
				'Qarın şişməsi',
				'Bağırsaq hərəkətlərində dəyişiklik',
				'Qəbizlik',
				'İshal',
				'Qarında qaz və köp'
			],
			Appendisit: ['Sağ alt qarın ağrısı', 'Bulantı', 'Qusma', 'Qızdırma', 'İştahsızlıq'],
			'Herniya (Yırtıq)': [
				'Qarın və ya qasıqda kütlə',
				'Hərəkət zamanı ağrı',
				'Yırtıq bölgəsində ağrı və narahatlıq',
				'Şişkinlik'
			],
			'Safra Kesesi Problemleri': [
				'Sağ üst qarın ağrısı',
				'Bulantı və qusma',
				'Qarın şişməsi',
				'Sarılıq (dərinin və gözlərin saralması)'
			],
			'Mədə və Bağırsaq Problemleri': [
				'Mədə ağrısı',
				'Mədə yanması',
				'Həzmsizlik',
				'Bulantı və qusma',
				'Bağırsaq tıkanıklığı'
			],
			'Pankreas Problemleri': [
				'Yuxarı qarın ağrısı',
				'Bulantı və qusma',
				'Qarında şişkinlik',
				'Sarılıq',
				'Pankreatit simptomları'
			],
			Hemoroidlər: [
				'Anal bölgədə ağrı',
				'Qanama',
				'Şişkinlik və qabarıqlıq',
				'Qaşıntı və narahatlıq'
			],
			'Göbək Yırtığı': ['Göbək bölgəsində ağrı', 'Şişkinlik', 'Hərəkət zamanı ağrı', 'Kütlə'],
			'Meme Problemleri': [
				'Meme ağrısı',
				'Meme kütlələri',
				'Meme şişləri',
				'Meme başından axıntı',
				'Meme dəri dəyişiklikləri'
			],
			'Dəri və Yumşaq Toxuma Problemleri': [
				'Dəri infeksiyaları',
				'Dəri absesi',
				'Dəri altı kütlələri',
				'Çibanlar',
				'Yara iyileşme problemləri'
			],
			'Tiroid Problemleri': [
				'Boyun önündə şişkinlik',
				'Səsdə dəyişiklik',
				'Udma çətinliyi',
				'Tiroid düyünləri'
			],
			'Travma və Yaralanmalar': [
				'Kəsiklər',
				'Yaralar',
				'Qırıq sümüklər',
				'Yaralanmalar sonrası ağrı',
				'Yaraların yavaş sağalması'
			],
			'Onkoloji Problemler': [
				'Qarın şişləri',
				'Bağırsaq şişləri',
				'Mədə şişləri',
				'Pankreas şişləri',
				'Dəri xərçəngi'
			],
			'Diğer Cerrahi Problemler': [
				'Cerrahi sonrası ağrı',
				'İnfeksiya riskləri',
				'Yara infeksiyaları',
				'Kəskin ağrılar',
				'Rehabilitasiya sonrası problemlər'
			]
		}
	},
	{
		id: 13,
		name: 'Beyin ve sinir cerrahisi',
		slug: 'beyin-ve-sinir-cerrahisi',
		conditions: {
			'Baş Ağrıları': ['Baş ağrısı', 'Migren', 'Kronik baş ağrıları', 'Küme baş ağrıları'],
			'Beyin Şişləri': [
				'Baş ağrısı',
				'Görmə və eşitmə problemləri',
				'Denge və koordinasiya çətinlikləri',
				'Qıcolmalar',
				'Beyin təzyiqi'
			],
			'Sinir Sıxışması': [
				'Əl və ayaqlarda uyuşma',
				'Karıncalanma',
				'Sinir ağrısı',
				'Hərəkət məhdudiyyəti'
			],
			'Onurğa Problemləri': [
				'Boyun ağrısı',
				'Bel ağrısı',
				'Disk yırtığı',
				'Skolyoz',
				'Onurğa stenozu'
			],
			'Qıcolmalar və Epilepsiya': [
				'Qıcolmalar',
				'Epileptik tutmalar',
				'Ani titrəmələr',
				'Bilinç itirilməsi'
			],
			'Damar Problemləri': [
				'Anevrizma',
				'Arteriyovenöz malformasiya (AVM)',
				'Beyin damarlarının daralması',
				'İnsult simptomları'
			],
			'Hərəkət Bozuklukları': [
				'Titrəmə',
				'Parkinson simptomları',
				'Əzələ spazmı',
				'Hərəkət zamanı ağrı'
			],
			'Kafa Travmaları': [
				'Başgicəllənmə',
				'Qıcolmalar',
				'Görmə və eşitmə problemləri',
				'Beyin sarsıntısı',
				'Kafa yaralanmaları'
			],
			'Sinir Sistemi İnfeksiyaları': ['Menenjit', 'Ensefalit', 'Abses', 'Sinir iltihabı'],
			Hydrosefali: [
				'Baş ağrısı',
				'Görmə problemləri',
				'Başgicəllənmə',
				'Denge çətinlikləri',
				'Kəllədaxili təzyiqin artması'
			],
			'Duyu Bozuklukları': [
				'Görmə itkisi',
				'Eşitmə itkisi',
				'Hissiyat itkisi',
				'Yanma və batma hissi'
			],
			'Neuroonkoloji Problemleri': [
				'Beyin şişləri',
				'Onurğa şişləri',
				'Sinir şişləri',
				'Metastatik beyin şişləri'
			],
			'Travma və Yaralanmalar': [
				'Kəllə qırıqları',
				'Onurğa qırıqları',
				'Baş və boyun yaralanmaları',
				'Sinir zədələnməsi'
			],
			'Refleks Bozuklukları': [
				'Anormal reflekslər',
				'Hərəkət reflekslərində dəyişiklik',
				'Refleks itkiləri'
			],
			'Digər Problemlər': [
				'Halsızlıq və yorğunluq',
				'Konsentrasiya çətinlikləri',
				'Yaddaş problemləri',
				'Əhval dəyişikliyi'
			]
		}
	},
	{
		id: 14,
		name: 'Fiziksel tıp ve rehabilitasyon',
		slug: 'fiziksel-tip-ve-rehabilitasyon',
		conditions: {
			Ağrı: [
				'Əzələ ağrısı',
				'Oynaq ağrısı',
				'Bel ağrısı',
				'Boyun ağrısı',
				'Baş ağrısı',
				'Sinə ağrısı',
				'Yumşaq toxuma ağrıları'
			],
			'Hərəkət Məhdudiyyəti': [
				'Hərəkət məhdudiyyəti',
				'Sərtlik',
				'Əzələ zəifliyi',
				'Koordinasiya çətinlikləri'
			],
			'İnme və Rehabilitasiya': [
				'Hərəkət itkisi',
				'Güc itkisi',
				'Denge problemləri',
				'Gündəlik fəaliyyətlərdə çətinlik',
				'Neyroplastisite'
			],
			'Onurğa Problemləri': [
				'Disk yırtığı',
				'Skolyoz',
				'Onurğa stenozu',
				'Onurğa travmaları',
				'Əzələ spazmı'
			],
			Osteoartrit: [
				'Oynaq ağrısı',
				'Oynaq sərtliyi',
				'Şişkinlik',
				'Hərəkət məhdudiyyəti',
				'Funksional itki'
			],
			'Reumatoid Artrit': [
				'Oynaq ağrısı',
				'Şişkinlik',
				'Gecə ağrısı',
				'Oynaq deformitələri',
				'Səhər sərtliyi'
			],
			'Ortopedik Rehabilitasiya': [
				'Qırıq sonrası reabilitasiya',
				'Əməliyyat sonrası reabilitasiya',
				'Əzələ gücləndirmə',
				'Hərəkətlilik məşqləri'
			],
			'Neyromüsküler Bozukluklar': [
				'Əzələ zəifliyi',
				'Hərəkət itkisi',
				'Koordinasiya problemləri',
				'Əzələ spazmı',
				'Sinir zədələnməsi'
			],
			'Travma Rehabilitasiyası': [
				'Travma sonrası ağrı',
				'Yaralanmalar sonrası reabilitasiya',
				'Funksional bərpa',
				'Əzələ və oynaq gücləndirmə'
			],
			'Kardiyopulmoner Rehabilitasiya': [
				'Ürək ağrısı',
				'Nəfəs darlığı',
				'Fiziki güc itkisi',
				'Nəfəs məşqləri',
				'Kardiyak funksiyanın bərpası'
			],
			'Pediatrik Rehabilitasiya': [
				'Uşaq inkişaf problemləri',
				'Serebral palsi',
				'Əzələ zəifliyi',
				'Hərəkətlilik çətinlikləri',
				'Koordinasiya məşqləri'
			],
			'Geriatrik Rehabilitasiya': [
				'Yaşlılıqda hərəkət itkisi',
				'Osteoporoz',
				'Əzələ gücləndirmə',
				'Denge və koordinasiya məşqləri',
				'Gündəlik fəaliyyətlərdə dəstək'
			],
			'İdman Yaralanmaları': [
				'Əzələ yırtılması',
				'Burxulma',
				'Qırıq',
				'Əməliyyat sonrası bərpa',
				'İdman performansının artırılması'
			],
			'Protez və Ortez': [
				'Protez istifadəsi',
				'Ortez dəstəyi',
				'Gündəlik həyat məşqləri',
				'Əl və ayaq funksiyasının bərpası'
			],
			'Yanıq və Yaraların Rehabilitasiyası': [
				'Yanıq sonrası bərpa',
				'Yara iyileşme problemləri',
				'Əzələ və dəri bərpası',
				'Hərəkət məşqləri'
			],
			'Digər Rehabilitasiya Problemləri': [
				'Kronik yorğunluq',
				'Fibromiyalji',
				'Bərpa sonrası ağrılar',
				'Funksional məşqlər',
				'Əzələ və oynaq sərtliyi'
			]
		}
	},
	{
		id: 15,
		name: 'Göğüs hastalıkları',
		slug: 'gogus-hastaliklari',
		conditions: {
			Astma: ['Nəfəs darlığı', 'Hırıltılı tənəffüs', 'Gecə öskürəyi', 'Sinə sıxılması'],
			'Kronik Obstruktiv Akciğer Hastalığı (KOAH)': [
				'Davamlı öskürək',
				'Nəfəs darlığı',
				'Balgam ifrazı',
				'Yorğunluq'
			],
			Pnevmoniya: [
				'Yüksək hərarət',
				'Titreme',
				'Öskürək ilə balgam',
				'Sinə ağrısı',
				'Nəfəs darlığı'
			],
			Bronşit: ['Davamlı öskürək', 'Balgam ifrazı', 'Sinə ağrısı', 'Yorğunluq', 'Nəfəs darlığı'],
			Sarkoidoz: ['Quru öskürək', 'Nəfəs darlığı', 'Sinə ağrısı', 'Yorğunluq', 'Dəri lezyonları'],
			'Pulmoner Emboliya': [
				'Ani nəfəs darlığı',
				'Sinə ağrısı',
				'Tez-tez ürək döyüntüsü',
				'Öskürək ilə qan'
			],
			Tüberküloz: [
				'Davamlı öskürək',
				'Balgamda qan',
				'Yüksək hərarət',
				'Gecə tərləmələri',
				'Kilo itkisi'
			],
			'Akciğer Kanseri': [
				'Davamlı öskürək',
				'Öskürək ilə qan',
				'Sinə ağrısı',
				'Nəfəs darlığı',
				'Yorğunluq və kilo itkisi'
			],
			'Uyku Apnesi': [
				'Yuxu zamanı nəfəsin dayanması',
				'Xorlama',
				'Gecə boyunca tez-tez oyanma',
				'Gün içində yuxululuq',
				'Konsentrasiya çətinliyi'
			],
			'Plevra Efüzyonu': ['Sinə ağrısı', 'Nəfəs darlığı', 'Quru öskürək', 'Yorğunluq', 'Hərarət'],
			'Pulmoner Hipertansiyon': [
				'Nəfəs darlığı',
				'Tez-tez ürək döyüntüsü',
				'Sinə ağrısı',
				'Yorğunluq',
				'Başgicəllənmə'
			],
			'Kistik Fibrozis': [
				'Davamlı öskürək',
				'Balgam ifrazı',
				'Nəfəs darlığı',
				'Tez-tez sinə infeksiyaları',
				'Kilo almama'
			],
			'İnterstisyel Akciğer Hastalıkları': [
				'Nəfəs darlığı',
				'Quru öskürək',
				'Yorğunluq',
				'Kilo itkisi',
				'Sinə ağrısı'
			],
			'Akut Respiratuvar Distress Sendromu (ARDS)': [
				'Şiddətli nəfəs darlığı',
				'Tez-tez nəfəs alma',
				'Sinə ağrısı',
				'Mavi rəngli dəri və dodaqlar',
				'Aşağı qan təzyiqi'
			],
			'Mesleki Akciğer Hastalıkları': [
				'Davamlı öskürək',
				'Nəfəs darlığı',
				'Sinə ağrısı',
				'Balgam ifrazı',
				'Kronik yorğunluq'
			],
			'Plevral Mezoletiyoma': [
				'Sinə ağrısı',
				'Nəfəs darlığı',
				'Quru öskürək',
				'Kilo itkisi',
				'Yorğunluq'
			],
			Bronşektazi: [
				'Davamlı öskürək',
				'Balgam ifrazı',
				'Nəfəs darlığı',
				'Sinə ağrısı',
				'Tez-tez sinə infeksiyaları'
			]
		}
	},
	{
		id: 16,
		name: 'Endokrinoloji',
		slug: 'endrokinoloji',
		conditions: {
			Diabet: [
				'Tez-tez susuzluq',
				'Tez-tez sidiyə çıxma',
				'Halsızlıq və yorğunluq',
				'Qəfil kilo itkisi',
				'Yaraların yavaş sağalması',
				'Bulantı və qusma',
				'Ayaqlarda uyuşma və ya karıncalanma'
			],
			Hipertireoz: [
				'Tez-tez ürək döyüntüsü',
				'Əl və ayaqlarda titrəmə',
				'Tez əsəbləşmə',
				'Tez-tez susuzluq',
				'Tez yorulma',
				'Yuxusuzluq',
				'Ağırlıq itkisi'
			],
			Hipotireoz: [
				'Halsızlıq və yorğunluq',
				'Kilo artımı',
				'Depressiya',
				'Soyuq həssaslığı',
				'Qəbizlik',
				'Dəri quruluğu',
				'Yaddaş problemləri'
			],
			'Cushing Sindromu': [
				'Kilo artımı',
				'Yüzdə və boyunda yağ yığılması',
				'Dərinin nazikləşməsi',
				'Yaraların yavaş sağalması',
				'Əzələ zəifliyi',
				'Menstrual dövr problemləri'
			],
			'Addison Xəstəliyi': [
				'Halsızlıq və yorğunluq',
				'Kilo itkisi',
				'Düşük qan təzyiqi',
				'Həddindən artıq susuzluq',
				'Tünd dəri rəngi (hiperpigmentasiya)',
				'Qarın ağrısı'
			],
			'Polikistik Over Sindromu (PCOS)': [
				'Nizamsız menstrual dövrlər',
				'Kilo artımı',
				'Saç tökülməsi',
				'Üzdə və bədəndə həddindən artıq tüklənmə',
				'Sızanaqlar'
			],
			'Hipofiz Bezi Problemləri': [
				'Baş ağrısı',
				'Görmə problemləri',
				'Yorğunluq',
				'Menstrual dövr problemləri',
				'Qıcolmalar',
				'Boy artımında dəyişikliklər'
			],
			'Paratiroid Bezi Problemləri': [
				'Yüksək qan kalsium səviyyəsi',
				'Sümük ağrısı',
				'Əzələ zəifliyi',
				'Həzm problemləri',
				'Böyrək daşları'
			],
			Feokromositoma: [
				'Tez-tez yüksək qan təzyiqi',
				'Tez-tez ürək döyüntüsü',
				'Tərləmə',
				'Baş ağrısı',
				'Yorğunluq',
				'Qəbizlik'
			],
			Akromegali: [
				'Əllərin və ayaqların böyüməsi',
				'Üz cizgilərinin kobudlaşması',
				'Baş ağrısı',
				'Görmə problemləri',
				'Yorğunluq',
				'Səsdə dəyişiklik'
			],
			'Metabolik Sindrom': [
				'Mərkəzi obezite (qarında yağ yığılması)',
				'Yüksək qan təzyiqi',
				'Yüksək qan şəkəri',
				'Yüksək trigliserid səviyyəsi',
				'Aşağı HDL (yaxşı) xolesterol səviyyəsi'
			],
			Hipoglisemiya: [
				'Tez aclıq',
				'Tərləmə',
				'Başgicəllənmə',
				'Tez ürək döyüntüsü',
				'Bilinç itkisi',
				'Sinirlilik'
			],
			Hipoqlisemiya: [
				'Tez aclıq',
				'Tərləmə',
				'Başgicəllənmə',
				'Tez ürək döyüntüsü',
				'Bilinç itkisi',
				'Sinirlilik'
			]
		}
	},
	{
		id: 17,
		name: 'Göz Hastalıkları',
		slug: 'goz-hastaliklari',
		conditions: {
			'Miopiya (Uzaqgörmə Zəifliyi)': [
				'Uzaqdakı obyektləri bulanıq görmə',
				'Göz qızartısı',
				'Göz yorğunluğu',
				'Baş ağrısı'
			],
			'Hipermetropiya (Yaxıngörmə Zəifliyi)': [
				'Yaxındakı obyektləri bulanıq görmə',
				'Göz qızartısı',
				'Göz yorğunluğu',
				'Baş ağrısı'
			],
			Astiqmatizm: [
				'Bulanıq və ya təhrif olunmuş görmə',
				'Göz qızartısı',
				'Göz yorğunluğu',
				'Baş ağrısı'
			],
			Presbiopiya: [
				'Yaxın obyektləri görmədə çətinlik',
				'Göz yorğunluğu',
				'Baş ağrısı',
				'Göz qızartısı'
			],
			Katarakta: [
				'Bulanıq görmə',
				'Gecə görmədə çətinlik',
				'Parlaq işıqlara həssaslıq',
				'Rəngləri görmədə çətinlik'
			],
			'Qlaukom (Qarasu)': [
				'Görmə sahəsində daralma',
				'Göz ağrısı',
				'Baş ağrısı',
				'Bulantı və qusma',
				'Halos'
			],
			'Makula Degenerasiyası': [
				'Mərkəzi görmədə itki',
				'Bulanıq və ya təhrif olunmuş görmə',
				'Parlaq işıqlara həssaslıq',
				'Rəngləri görmədə çətinlik'
			],
			'Diabetik Retinopatiya': [
				'Bulanıq görmə',
				'Qara nöqtələr və ya çizgilər görmə sahəsində',
				'Görmə itkisi',
				'Görmə sahəsində ləkələr'
			],
			'Retinal Detasman': [
				'Göz önündə pərdə hissi',
				'Yüngül çırpınmalar və ya yanıb-sönən işıqlar',
				'Görmə sahəsində qaranlıq sahələr',
				'Görmə itkisi'
			],
			Keratit: [
				'Göz ağrısı',
				'Göz qızartısı',
				'Bulanıq görmə',
				'İşığa həssaslıq',
				'Göz yaşı axması'
			],
			'Konjonktivit (Qırmızı Göz)': [
				'Göz qızartısı',
				'Göz yaşı axması',
				'Qaşınma',
				'Göz ifrazatı',
				'Göz qapaqlarının şişməsi'
			],
			Blefarit: [
				'Göz qapaqlarında qızartı',
				'Qaşınma',
				'Göz qapaqlarında qabıqlar',
				'Göz ağrısı',
				'Göz qapaqlarının şişməsi'
			],
			Uveit: ['Göz ağrısı', 'Göz qızartısı', 'Bulanıq görmə', 'İşığa həssaslıq', 'Göz yaşı axması'],
			'Göz Allergiyaları': [
				'Qaşınma',
				'Göz qızartısı',
				'Göz yaşı axması',
				'Şişkinlik',
				'İşığa həssaslıq'
			],
			'Göz Kuruluğu': [
				'Quru və qaşıntılı gözlər',
				'Yandırma hissi',
				'Bulanıq görmə',
				'Göz yorğunluğu',
				'Göz qızartısı'
			],
			'Şaşılık (Strabismus)': [
				'Gözlərdə uyğun olmayan mövqelər',
				'Görmə itkisi',
				'Göz yorğunluğu',
				'Baş ağrısı',
				'Göz qızartısı'
			],
			'Göz Yaralanmaları': [
				'Göz ağrısı',
				'Göz qızartısı',
				'Bulanıq görmə',
				'Göz yaşı axması',
				'Görmə itkisi'
			]
		}
	}
];
