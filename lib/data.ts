import type { ZenPhrase } from "./types";

export const MONTHS = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月","通年"];

export const MONTH_NAMES = ["睦月","如月","弥生","卯月","皐月","水無月","文月","葉月","長月","神無月","霜月","師走"];

export const CATEGORIES = ["薄茶","濃茶","炭手前","花","懐石","茶事","その他"];

export const SEASONAL_GREETINGS = [
  "新しい年の始まり。清々しい気持ちで一服を。",
  "梅の便りが届く頃。春の訪れを待ちながら。",
  "弥生の空に花の色。心もほころぶ季節です。",
  "花散る頃の静けさの中に、新たな始まりを。",
  "若葉薫る風に誘われて。生命力に満ちた季節。",
  "水無月の雨音に耳を傾けて。静かなひととき。",
  "夏の盛り。涼を求めて一碗のお茶を。",
  "残暑の中にも秋の気配。季節の移ろいを感じて。",
  "名月を仰ぎ見る秋の夜。心静かに。",
  "山が錦に染まる頃。深まる秋を愛でながら。",
  "初霜の朝。温かいお茶が身に沁みる季節。",
  "師走の喧騒の中にも、一服の静けさを。",
];

export const ZENGO_DATA: ZenPhrase[] = [
  // 1月
  { name: "松無古今色", reading: "まつにここんのいろなし", month: 0, type: "禅語", meaning: "松は千年変わらず緑を保つ。真理は時代を超えて不変であることを示す。" },
  { name: "日々是好日", reading: "にちにちこれこうにち", month: 0, type: "禅語", meaning: "毎日がかけがえのない素晴らしい日。あるがままを受け入れる心。" },
  { name: "瑞雲", reading: "ずいうん", month: 0, type: "銘", meaning: "めでたいことの前兆として現れる五色の雲。新年の吉兆を祝う。" },
  { name: "初釜", reading: "はつがま", month: 0, type: "銘", meaning: "新年最初の茶会。年の始めに茶の心を新たにする。" },
  { name: "寿山", reading: "じゅざん", month: 0, type: "銘", meaning: "長寿を祝う山。新年のめでたさを表す。" },
  // 2月
  { name: "春光", reading: "しゅんこう", month: 1, type: "銘", meaning: "春のうららかな光。寒さの中にも確かに感じる春の気配。" },
  { name: "淡雪", reading: "あわゆき", month: 1, type: "銘", meaning: "はかなく消えゆく雪。春の訪れを感じさせる季節の移ろい。" },
  { name: "雪間", reading: "ゆきま", month: 1, type: "銘", meaning: "雪が消えかけた合間。そこから新しい芽が顔を出す生命力。" },
  { name: "東風", reading: "こち", month: 1, type: "銘", meaning: "東から吹く春を告げる風。梅の花の香りを運ぶ。" },
  { name: "不動心", reading: "ふどうしん", month: 1, type: "禅語", meaning: "何事にも動じない確固たる心。外界に惑わされない境地。" },
  // 3月
  { name: "花衣", reading: "はなごろも", month: 2, type: "銘", meaning: "花見に着ていく晴れ着。また、散る桜の花びらが衣にかかる様。" },
  { name: "春霞", reading: "はるがすみ", month: 2, type: "銘", meaning: "春の野山にたなびく霞。柔らかくおぼろげな春の情景。" },
  { name: "柳緑花紅", reading: "やなぎはみどりはなはくれない", month: 2, type: "禅語", meaning: "柳は緑、花は紅。ありのままの自然の姿こそが真理である。" },
  { name: "麗日", reading: "れいじつ", month: 2, type: "銘", meaning: "うららかに晴れた美しい日。春の穏やかな一日。" },
  { name: "忘れ雪", reading: "わすれゆき", month: 2, type: "銘", meaning: "春になって忘れた頃に降る雪。季節の名残り。" },
  // 4月
  { name: "花吹雪", reading: "はなふぶき", month: 3, type: "銘", meaning: "桜の花びらが風に舞い散る様子。春の華やかさとはかなさ。" },
  { name: "清風", reading: "せいふう", month: 3, type: "銘", meaning: "さわやかな風。心を清める澄んだ風。" },
  { name: "花筏", reading: "はないかだ", month: 3, type: "銘", meaning: "水面に散った花びらが連なって流れる様子。儚い美しさ。" },
  { name: "喫茶去", reading: "きっさこ", month: 3, type: "禅語", meaning: "まぁお茶を一杯どうぞ。分け隔てなく誰にでも茶を勧める心。" },
  { name: "薫風", reading: "くんぷう", month: 3, type: "銘", meaning: "若葉の香りを運ぶ初夏の風。生命力に満ちた爽やかさ。" },
  // 5月
  { name: "五月雨", reading: "さみだれ", month: 4, type: "銘", meaning: "旧暦五月に降り続く長雨。しとしとと降る梅雨の雨。" },
  { name: "早苗", reading: "さなえ", month: 4, type: "銘", meaning: "田植えのための若い稲の苗。新しい命の始まり。" },
  { name: "緑陰", reading: "りょくいん", month: 4, type: "銘", meaning: "木々の緑が作る涼しい木陰。夏の憩いの場。" },
  { name: "看脚下", reading: "かんきゃっか", month: 4, type: "禅語", meaning: "足元をよく見よ。遠くを見る前に、今この瞬間の自分を見つめよ。" },
  { name: "杜若", reading: "かきつばた", month: 4, type: "銘", meaning: "水辺に咲く紫の花。伊勢物語の歌枕としても名高い。" },
  // 6月
  { name: "清流", reading: "せいりゅう", month: 5, type: "銘", meaning: "澄んだ美しい水の流れ。涼を誘う夏の風情。" },
  { name: "蛍火", reading: "ほたるび", month: 5, type: "銘", meaning: "蛍の放つ淡い光。闇の中にゆらめく幻想的な光。" },
  { name: "苔清水", reading: "こけしみず", month: 5, type: "銘", meaning: "苔むした岩間から湧き出る清水。山深い涼やかさ。" },
  { name: "無功徳", reading: "むくどく", month: 5, type: "禅語", meaning: "見返りを求めない行い。達磨大師が梁の武帝に説いた言葉。" },
  { name: "翡翠", reading: "かわせみ", month: 5, type: "銘", meaning: "渓流に棲む美しい鳥。鮮やかな青緑の羽色。" },
  // 7月
  { name: "夕凪", reading: "ゆうなぎ", month: 6, type: "銘", meaning: "夕方、風が止んで海が穏やかになる時。静寂のひととき。" },
  { name: "涼風", reading: "りょうふう", month: 6, type: "銘", meaning: "暑さの中に感じる涼しい風。夏の安らぎ。" },
  { name: "白雲", reading: "はくうん", month: 6, type: "禅語", meaning: "空に浮かぶ白い雲。何ものにも執着せず自由に漂う心。" },
  { name: "天の川", reading: "あまのがわ", month: 6, type: "銘", meaning: "夜空を横切る星の帯。七夕の物語を紡ぐ。" },
  { name: "風鈴", reading: "ふうりん", month: 6, type: "銘", meaning: "風に揺れて涼しい音を立てる鈴。夏の風物詩。" },
  // 8月
  { name: "秋風", reading: "あきかぜ", month: 7, type: "銘", meaning: "秋の気配を運ぶ風。夏の終わりと秋の始まりの境目。" },
  { name: "残暑", reading: "ざんしょ", month: 7, type: "銘", meaning: "立秋を過ぎてもなお残る暑さ。夏の名残り。" },
  { name: "行雲流水", reading: "こううんりゅうすい", month: 7, type: "禅語", meaning: "行く雲、流れる水のように。執着せず自由に生きる姿。" },
  { name: "送り火", reading: "おくりび", month: 7, type: "銘", meaning: "お盆にご先祖の霊を送り出す火。夏の終わりの風物詩。" },
  { name: "露草", reading: "つゆくさ", month: 7, type: "銘", meaning: "朝露に濡れる小さな青い花。儚く美しい。" },
  // 9月
  { name: "名月", reading: "めいげつ", month: 8, type: "銘", meaning: "中秋の名月。澄んだ秋の夜空に輝く美しい満月。" },
  { name: "秋桜", reading: "こすもす", month: 8, type: "銘", meaning: "秋に咲くコスモス。秋風に揺れる可憐な花。" },
  { name: "月影", reading: "つきかげ", month: 8, type: "銘", meaning: "月の光。また月そのもの。秋の夜の静寂を照らす。" },
  { name: "一期一会", reading: "いちごいちえ", month: 8, type: "禅語", meaning: "この出会いは一生に一度きり。今この瞬間を大切にする茶の心。" },
  { name: "虫の音", reading: "むしのね", month: 8, type: "銘", meaning: "秋の夜に響く虫の声。鈴虫や松虫の澄んだ音色。" },
  // 10月
  { name: "紅葉", reading: "もみじ", month: 9, type: "銘", meaning: "秋に色づく木々の葉。山を錦に染める美しさ。" },
  { name: "秋深し", reading: "あきふかし", month: 9, type: "銘", meaning: "深まりゆく秋の趣。寂しさの中にある美しさ。" },
  { name: "山粧う", reading: "やまよそおう", month: 9, type: "銘", meaning: "紅葉で山が美しく装う様子。秋の山の華やかさ。" },
  { name: "知足", reading: "ちそく", month: 9, type: "禅語", meaning: "足るを知る。今あるものに満足し感謝する心。" },
  { name: "錦秋", reading: "きんしゅう", month: 9, type: "銘", meaning: "紅葉が錦のように美しい秋。色とりどりの秋の山。" },
  // 11月
  { name: "初霜", reading: "はつしも", month: 10, type: "銘", meaning: "その年初めて降りる霜。冬の到来を告げる。" },
  { name: "木枯し", reading: "こがらし", month: 10, type: "銘", meaning: "晩秋から初冬にかけて吹く冷たい風。木の葉を散らす。" },
  { name: "落葉", reading: "おちば", month: 10, type: "銘", meaning: "散り落ちる木の葉。万物が静かに眠りにつく準備。" },
  { name: "無事", reading: "ぶじ", month: 10, type: "禅語", meaning: "何事もなく平穏であること。最高の境地は日常の中にある。" },
  { name: "時雨", reading: "しぐれ", month: 10, type: "銘", meaning: "晩秋から初冬にかけて降ったり止んだりする雨。" },
  // 12月
  { name: "雪月花", reading: "せつげっか", month: 11, type: "禅語", meaning: "雪と月と花。日本の自然美の象徴。四季折々の美を愛でる心。" },
  { name: "冬至", reading: "とうじ", month: 11, type: "銘", meaning: "一年で最も昼が短い日。ここから日が長くなり始める再生の時。" },
  { name: "枯野", reading: "かれの", month: 11, type: "銘", meaning: "草木が枯れた冬の野原。寂寥の中にある静かな美。" },
  { name: "歳暮", reading: "せいぼ", month: 11, type: "銘", meaning: "年の暮れ。一年を振り返り感謝する時期。" },
  { name: "帰去来", reading: "ききょらい", month: 11, type: "禅語", meaning: "さぁ帰ろう。本来の自分に立ち返ること。陶淵明の詩より。" },
  // 通年
  { name: "和敬清寂", reading: "わけいせいじゃく", month: 12, type: "禅語", meaning: "茶道の精神を表す四字。互いを敬い、清らかで静かな心で。" },
  { name: "主人公", reading: "しゅじんこう", month: 12, type: "禅語", meaning: "本来の自分自身のこと。常に自己の主となれ。" },
  { name: "放下着", reading: "ほうげじゃく", month: 12, type: "禅語", meaning: "すべてを捨て去れ。執着を手放した先にある自由。" },
  { name: "平常心", reading: "へいじょうしん", month: 12, type: "禅語", meaning: "特別なことのない普段の心。それこそが道である。" },
  { name: "守破離", reading: "しゅはり", month: 12, type: "禅語", meaning: "師の教えを守り、やがて破り、最後に離れて独自の道を歩む。" },
];

// Kakejiku images mapped to zen phrases
export const ZENGO_IMAGES: Record<string, string> = {
  "松無古今色": "https://thumbnail.image.rakuten.co.jp/@0_mall/kakejikuya/cabinet/06218648/imgrc0080137588.jpg",
  "日々是好日": "https://thumbnail.image.rakuten.co.jp/@0_mall/kakejikuya/cabinet/06218648/imgrc0080136419.jpg",
  "柳緑花紅": "https://thumbnail.image.rakuten.co.jp/@0_mall/kakejikuya/cabinet/06218648/imgrc0080137724.jpg",
  "和敬清寂": "https://thumbnail.image.rakuten.co.jp/@0_mall/kakejikuya/cabinet/06218648/imgrc0080136364.jpg",
  "喫茶去": "https://thumbnail.image.rakuten.co.jp/@0_mall/kakejikuya/cabinet/06218648/imgrc0080137651.jpg",
  "一期一会": "https://thumbnail.image.rakuten.co.jp/@0_mall/kakejikuya/cabinet/06218648/imgrc0080136377.jpg",
  "行雲流水": "https://thumbnail.image.rakuten.co.jp/@0_mall/kakejikuya/cabinet/06218648/imgrc0080137592.jpg",
  "知足": "https://thumbnail.image.rakuten.co.jp/@0_mall/kakejikuya/cabinet/06218648/imgrc0080136379.jpg",
};
