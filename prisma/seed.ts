import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // --- ES Templates ---
  // 1. 玩具・エンタメメーカー系
  await prisma.esTemplate.upsert({
    where: { id: 'template_toy_ent_mot_200' },
    update: {},
    create: {
      id: 'template_toy_ent_mot_200',
      industry: '玩具エンタメ',
      type: 'MOTIVATION',
      title: 'インターン志望動機（玩具・エンタメ）',
      wordCount: 200,
      content: '幼少期から特撮・ガンダム・ガンプラに夢中になり、おもちゃが父との絆をつくってくれたという原体験があります。その経験から、コンテンツが人の心を豊かにし、人と人をつなぐ力を持つと実感してきました。現在はプログラミング・レゴ教室の講師としてSTEM教育に携わる中で、テクノロジーとエンタメを融合した体験設計の可能性に強く惹かれています。貴社のインターンを通じて、その最前線を学びたいです。',
    },
  });

  await prisma.esTemplate.upsert({
    where: { id: 'template_toy_ent_mot_400' },
    update: {},
    create: {
      id: 'template_toy_ent_mot_400',
      industry: '玩具エンタメ',
      type: 'MOTIVATION',
      title: 'インターン志望動機（玩具・エンタメ）',
      wordCount: 400,
      content: '私が貴社のインターンを志望する理由は、幼少期から積み重ねてきたおもちゃが人を幸せにするという原体験にあります。再婚で父ができた小学生の頃、特撮やガンダムの話を通じて自然と仲が深まりました。おもちゃやコンテンツは、ただの遊び道具ではなく、人と人の心をつなぎ、世界を広げるものだと体で感じました。その原体験が、今のテクノロジーで世の中にワクワクを届けたいという目標の原点です。\n\n現在、小学生向けプログラミング・レゴ教室の講師として、子どもたちが作品を完成させた瞬間の目の輝きを毎回目の当たりにしています。テクノロジーとクリエイティビティが融合した体験が、人を動かす力を持つと確信しています。貴社は〇〇という強みを持ち、その実現を最も高い次元で体験・学習できる場だと考え、このインターンに参加したいと思いました。',
    },
  });

  // 2. IT・メガベンチャー系
  await prisma.esTemplate.upsert({
    where: { id: 'template_it_mot_200' },
    update: {},
    create: {
      id: 'template_it_mot_200',
      industry: 'IT',
      type: 'MOTIVATION',
      title: 'インターン志望動機（IT・メガベンチャー）',
      wordCount: 200,
      content: 'テクノロジーで人々の日常に新しい体験と豊かさを届けたいという思いから、IT業界を志望しています。雪下ろしロボットの研究でシステム開発の上流から下流を一気通貫で経験し、仕組みが社会を変える可能性を実感しました。また、新歓委員会の立ち上げでアナログな組織運営を仕組みで改善した経験から、DXへの強い関心があります。貴社のインターンで事業の最前線を学びたいです。',
    },
  });

  await prisma.esTemplate.upsert({
    where: { id: 'template_it_mot_400' },
    update: {},
    create: {
      id: 'template_it_mot_400',
      industry: 'IT',
      type: 'MOTIVATION',
      title: 'インターン志望動機（IT・メガベンチャー）',
      wordCount: 400,
      content: 'テクノロジーを使って、人々の日常をより豊かでワクワクするものに変えたいという思いから貴社を志望しました。大学院でロボット開発の研究を行う中で、課題設定から設計・実装・検証まで一気通貫で携わり、テクノロジーが社会課題を解決する実感を得ました。\n\nまた、学園祭実行委員会の委員長や新歓委副委員長として、属人的なタスク管理を業務リスト化によって構造化し、6人から50人規模の組織を自走させた経験から、仕組みづくりこそがスケール可能な価値創出の鍵だと確信しています。貴社は〇〇という事業で、スピード感ある挑戦と大きなスケールの価値提供を両立している点に魅力を感じています。インターンを通じて、データドリブンな意思決定や事業開発の思考法を吸収したいと考えています。',
    },
  });

  // 3. SIer・ITコンサル系
  await prisma.esTemplate.upsert({
    where: { id: 'template_sier_mot_200' },
    update: {},
    create: {
      id: 'template_sier_mot_200',
      industry: 'SIer',
      type: 'MOTIVATION',
      title: 'インターン志望動機（SIer・ITコンサル）',
      wordCount: 200,
      content: '顧客の潜在的な課題を引き出し、テクノロジーで解決策を設計する上流工程の仕事に強い関心があります。雪下ろしロボットの研究で課題設定から実装まで一気通貫を経験し、新歓委員会では組織の課題を仕組みで解決しました。これらの経験を通じ、IT×課題解決思考を軸にしたSIer・コンサルの仕事に自分の強みが活きると確信し、貴社インターンを志望します。',
    },
  });

  await prisma.esTemplate.upsert({
    where: { id: 'template_sier_mot_400' },
    update: {},
    create: {
      id: 'template_sier_mot_400',
      industry: 'SIer',
      type: 'MOTIVATION',
      title: 'インターン志望動機（SIer・ITコンサル）',
      wordCount: 400,
      content: '私が目指すのは、技術と対話力を組み合わせて顧客の真の課題を解決する仕事です。大学院の研究では、未開拓分野である雪下ろしロボットの開発を通じ、課題定義・設計・検証という上流から下流を一人で担いました。また、学園祭実行委員会の委員長として大学当局と交渉し制限を撤廃した経験や、新歓委員会で6人から50人規模の組織を仕組み化して自走させた経験は、複数のステークホルダーを動かす推進力とコミュニケーション力を磨いてくれました。\n\nSIerはこれらすべての力を発揮できるフィールドだと考えています。貴社は〇〇という強みを持ち、大規模システムから業務改革まで一気通貫で携われる点に魅力を感じています。インターンで、プロジェクトの実際の動き方と課題解決の思考プロセスを学びたいと考えています。',
    },
  });

  // 共通ベースパーツ
  await prisma.esTemplate.upsert({
    where: { id: 'template_common_pr_200' },
    update: {},
    create: {
      id: 'template_common_pr_200',
      industry: '全業界',
      type: 'SELF_PR',
      title: '自己PR（共通）',
      wordCount: 200,
      content: '私の強みは、自ら率先して動き、挑戦する組織の雰囲気を作り出す力です。新入生歓迎委員会の副委員長として、コロナ禍で形骸化した組織に理念を掲げ、メンバーと対話を重ねながら新企画を実行しました。6人から50人規模に拡大し、例年以上のアンケート高評価を達成。この推進力を貴社インターンでも発揮します。',
    },
  });

  await prisma.esTemplate.upsert({
    where: { id: 'template_common_pr_400' },
    update: {},
    create: {
      id: 'template_common_pr_400',
      industry: '全業界',
      type: 'SELF_PR',
      title: '自己PR（共通）',
      wordCount: 400,
      content: '私の強みは、自ら率先して動き、組織に挑戦する雰囲気を生み出す力です。新入生歓迎委員会の副委員長として、コロナ禍で新歓文化が失われゼロからのスタートを経験しました。大学をもっと好きになってほしいという理念を掲げ、学園祭運営の経験をもとに半年間の業務リストを作成。メンバー一人一人と対話しやってみたいが実現できる環境を作ることで、自発的に動く組織の雰囲気を生み出しました。\n\n結果として6人から50人規模に拡大し、新入生アンケートでは例年以上の高評価を達成。挑戦し続けるマインドは今も組織に受け継がれています。この力を、インターンでも積極的に発揮します。',
    },
  });

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });