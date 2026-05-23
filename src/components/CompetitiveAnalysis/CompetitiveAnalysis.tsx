import React, { useState, useEffect } from 'react';
import './CompetitiveAnalysis.css';

interface Competitor {
  id: string;
  name: string;
  jpName?: string;
  type: 'direct' | 'indirect';
  x: number; // 0 (Retrospective) to 100 (Action Support)
  y: number; // 0 (High Info/High Load) to 100 (Low Info/High Focus)
  philosophy: string;
  strengths: string[];
  weaknesses: string[];
  edge: string;
  isCircadian?: boolean;
}

const COMPETITORS: Competitor[] = [
  {
    id: 'circadian',
    name: 'Circadian (本製品)',
    jpName: 'Circadian',
    type: 'direct',
    x: 92,
    y: 88,
    isCircadian: true,
    philosophy: '「開いた瞬間に今何をすべきか」を0.5秒で判定し、24時間時計で残り時間を体感させる。徹底的なミニマリズムと行動駆動。',
    strengths: ['24時間時計による時間の空間的・直感的可視化', '今のタスク1件に集中させる極限のミニマリズム', '一切の広告や課金がなく、完全にフリー＆オープン', 'クロスプラットフォーム（Web）で摩擦ゼロ起動'],
    weaknesses: [],
    edge: '「時間認知」「タスク完了」「今への集中」を1画面に完全統合した、ハッカソンにおける絶対的独自価値。'
  },
  {
    id: 'sectograph',
    name: 'Sectograph',
    type: 'direct',
    x: 75,
    y: 65,
    philosophy: 'Googleカレンダーの予定を12/24時間の円形ダイヤルに自動投影するビジュアルプランナー。',
    strengths: ['ウィジェット機能が優秀でホーム画面で見やすい', 'GoogleカレンダーやOutlookとリアルタイムで強固に同期', 'WearOS対応でスマートウォッチとの親和性が高い'],
    weaknesses: ['❌ 独自のタスク管理機能がない（カレンダーのビューワーにすぎない）', '❌ タスクを完了してチェックするフローがない', '❌ 一部高度なカスタマイズ機能は有料課金が必要'],
    edge: 'Sectographは「ただ予定を円形に見せるだけ」。Circadianは「円形表示の中でタスクを作り、進行し、チェック完了する」アクション統合型ツールです。'
  },
  {
    id: 'ichinichi',
    name: '一日予定表 (Kiyoh Inc.)',
    jpName: '一日予定表',
    type: 'direct',
    x: 32,
    y: 55,
    philosophy: '円グラフで毎日の生活スケジュールを表現し、過去の活動実績を記録・集計して振り返る。',
    strengths: ['1タップでその時間の活動カラーを素早く登録', '円グラフや棒グラフでの振り返り・時間分析機能が優秀', '習慣化トラッキングに向いているシンプルな操作性'],
    weaknesses: ['❌ 過去の記録・振り返りに特化し、未来の行動へのリアルタイム支援が弱い', '❌ 「今のタスク名＋残り時間」のシーカーカウントダウンがない', '❌ 外部カレンダー連携がなくクローズド'],
    edge: '一日予定表は「過去を記録・集計する」振り返りツール。Circadianは「今、そしてこれからの行動をリアルタイムで走らせる」駆動型ツールです。'
  },
  {
    id: 'kurun',
    name: 'Kurun',
    type: 'direct',
    x: 25,
    y: 60,
    philosophy: '毎日の活動をサークル上に色分けして記録し、生活リズムの乱れや「行方不明の時間」を発見する。',
    strengths: ['グラフィカルでかわいいUIデザイン', '生活の余白やリズムの可視化に秀でている', '振り返り用の日記やメモ機能と連動'],
    weaknesses: ['❌ タスクごとの細かいタスク名登録や完了チェックがない', '❌ リアルタイムでのカウントダウン針機能がない', '❌ アプリ内にとどまるため、カレンダーや他のワークフローと融合しにくい'],
    edge: 'Kurunは「生活習慣の自己分析」ツール。Circadianは「今日の課題を倒すための戦闘用」時間割ツールです。'
  },
  {
    id: 'owaves',
    name: 'Owaves',
    type: 'direct',
    x: 60,
    y: 75,
    philosophy: '医師や心理学者が開発。24時間時計を使って睡眠、食事、運動、仕事を自然のサーカディアンリズムに同期させる。',
    strengths: ['8つのウェルネスカテゴリに基づいた非常に美しい円形UI', 'ヘルスケア（Apple Health）と同期し、生体データを活用', 'Moaiと呼ばれるSNS機能で家族や友人と予定を共有・励まし合える'],
    weaknesses: ['❌ iOS / Appleエコシステム専用（AndroidやPCで使えない）', '❌ 学業や仕事の細かなタスク管理・チェックリスト・優先度設定が苦手', '❌ ウェルネス向上目的のため、タスクをバリバリこなすのには向かない'],
    edge: 'Owavesは「健康・ライフスタイルの調整」ツール。Circadianは「完全無料・Web対応」で、学生や開発者が今すぐ作業に集中するためのタスク支援に最適化されています。'
  },
  {
    id: 'structured',
    name: 'Structured',
    type: 'indirect',
    x: 78,
    y: 50,
    philosophy: '美しい線状タイムラインとアイコンで、1日のルーティンや予定を上から順に可視化する。',
    strengths: ['極めてモダンで洗練されたビジュアル、触るのが楽しいUI', 'カレンダーやリマインダーとのシームレスな自動取り込み', 'サブタスクや通知設定など細かい予定構築が得意'],
    weaknesses: ['❌ 縦方向にズラリと並ぶタイムラインが「迫り来る仕事の壁」になり、圧倒される', '❌ 円形での「時間のボリューム感覚（残り時間の直感性）」が薄い', '❌ Pro機能は月額サブスクリプションが必要'],
    edge: 'Structuredは優れた「縦線型」プランナーですが、予定が多すぎるとスクロールの山になります。Circadianは「24時間円」で時間の有限性を伝えつつ、「今やるべき1点」だけを際立たせるため、認知負担を極限まで下げられます。'
  },
  {
    id: 'sunsama',
    name: 'Sunsama',
    type: 'indirect',
    x: 82,
    y: 35,
    philosophy: '朝の計画と夜の振り返りルーティンを強制し、過度な働きすぎを防いでマインドフルに働く。',
    strengths: ['GitHub, Jira, Trello, Gmailからタスクを引き込める強力な統合', '「今日やることを現実的な量に絞る」ための優れたステップ設計', 'ポモドーロタイマーとタイムトラッキングの一体化'],
    weaknesses: ['❌ 月額$16〜20（約2,500円〜3,000円）と極めて高価', '❌ 学生やカジュアルなユーザーには機能が過多で、使いこなす摩擦が大きい', '❌ 円形時計などのビジュアル表現はなく、伝統的なタイムボックスGrid'],
    edge: 'Sunsamaは「プロ向けの重厚なプランニング」。Circadianは「大学生・ハッカソン参加者向けの、完全無料で瞬時に使える時間可視化ツール」です。'
  },
  {
    id: 'tiimo',
    name: 'Tiimo',
    type: 'indirect',
    x: 70,
    y: 70,
    philosophy: 'ADHDや自閉症スペクトラムなど、視覚支援を必要とする人向けにルーティンや時間経過をカウントダウン可視化する。',
    strengths: ['タイムカウントダウンの進捗インジケーターが非常にわかりやすい', 'ADHD当事者が使いやすいよう感覚的にデザインされている', 'ルーティンの自動作成と通知が親切'],
    weaknesses: ['❌ 月額課金の有料アプリである', '❌ 学業課題やビジネスの突発的なToDoをリスト管理・調整するのには向かない', '❌ UIが幼児・子ども向けに近く、一般の学生や社会人が普段使いするには好みが分かれる'],
    edge: 'Tiimoは「発達障害・ルーティン支援」に特化。Circadianは「誰にでも必要な『今やることへの集中』と『24時間の時間の有限性』」を、大人っぽく洗練されたダークなマテリアルデザインで提供します。'
  },
  {
    id: 'rise',
    name: 'Rise Science',
    type: 'indirect',
    x: 15,
    y: 80,
    philosophy: '睡眠負債と体内時計（サーカディアンリズム）の波を分析し、一日のエネルギーピークとディップを可視化する。',
    strengths: ['生体科学に基づいた体内時計の「エネルギー波形」表示', '睡眠の質をトラッキングし、いつ集中すべきかを科学的に予測'],
    weaknesses: ['❌ 予定の登録やタスク管理、チェックリスト機能は一切ない', '❌ 睡眠トラッカーやスマホセンサーの連携が必要で、導入ハードルが高い', '❌ 完全有料サブスクリプション'],
    edge: 'Riseは「生体リズムを測る」ツール。Circadianは「生体リズムに配慮したダークな画面で、実際に作業時間をブロックしてタスクを処理する」実行ツールです。'
  },
  {
    id: 'gcal',
    name: 'Google カレンダー',
    type: 'indirect',
    x: 65,
    y: 15,
    philosophy: '世界標準のスケジュール管理ツール。会議や予定をすべて登録し、他者と共有する。',
    strengths: ['圧倒的なシェア、無料、他サービスとの無限の連携', '予定の招待、繰り返し、複数カレンダーの重ね合わせ機能'],
    weaknesses: ['❌ 情報過多で画面が埋まり、開いた瞬間に「今何をすべきか」がわからない', '❌ リスト・格子表示のため、直感的な「今日残り何時間あるか」が脳内で処理しにくい', '❌ 登録フォームの入力項目が多く、タスク追加の摩擦が高い'],
    edge: 'カレンダーは「他人との約束・イベントを記録する」場所。Circadianは「自分の時間をどう使うか」に特化した、自己対話のためのクローズドスペースです。'
  },
  {
    id: 'todoist',
    name: 'Todoist',
    type: 'indirect',
    x: 85,
    y: 20,
    philosophy: '世界で最も使われているテキストベースのタスクマネージャー。Inboxを空にすることを目指す。',
    strengths: ['爆速の入力、自然言語処理（「明日10時に宿題」で自動登録）', '優先度、プロジェクト、タスクの階層化が極めてスムーズ'],
    weaknesses: ['❌ リスト形式のため、「そのタスクを何時から何時までやるか（時間枠）」が表現しにくい', '❌ 未完了のタスクがリストの下部に溜まり続け、強烈な認知ストレス（先延ばし）を生む', '❌ 時間の残り感覚がつかめない'],
    edge: 'Todoistは「何をやるか」を登録する場所。Circadianはそれを「いつやるか」の24時間の器に配置し、時間の枯渇を実感させることで、先延ばしを強制的に防止します。'
  },
  {
    id: 'ticktick',
    name: 'TickTick',
    type: 'indirect',
    x: 88,
    y: 18,
    philosophy: 'ToDoリスト、カレンダータイムブロック、ポモドーロ、習慣トラッカーを一つに統合した万能薬。',
    strengths: ['機能の網羅性が市場最強レベル', 'カレンダービューでのドラッグ＆ドロップ時間割り当てが快適'],
    weaknesses: ['❌ 高機能すぎてアプリが非常に重く、設定が複雑（機能過多によるストレス）', '❌ 24時間ダイヤルのような象徴的な直感ビジュアルはない', '❌ カレンダータイムブロックや高度な検索は有料プレミアム必須'],
    edge: 'TickTickは「多機能オールインワン」。Circadianは機能を削ぎ落とし、「24時間時計」と「今やるタスク1件」の2つに美学を集約したミニマリズムです。'
  }
];

const SLIDE_NOTES = [
  {
    num: 1,
    badge: 'タイトル',
    title: '開いた瞬間に"今"がわかる — 24時間スケジューラー 「CHRONOS」',
    visual: '金色のネオンのようにCHRONOSのロゴが妖しく脈打ち、背後で24時間時計の盤面がアンビエントにゆっくり回転します。',
    script: '「皆さん、こんにちは。私たちは『情報過多の時代に、瞬時に今やるべきことに没頭できる』時間可視化アプリ、Circadian（CHRONOS）を開発しました。まずは、私たちのアプリの哲学を説明します。」'
  },
  {
    num: 2,
    badge: '現代の課題 (混沌)',
    title: 'タスク管理アプリを開いて、逆に疲れていませんか？',
    visual: '散らかったタスクリストの上に、赤色の未読通知バッジ（99+, 50, 124）が次々とボヨンと弾みながら出現し、視覚的な重圧（ストレス）を表します。',
    script: '「現代のタスク管理アプリを開いた時、皆さんどう感じますか？ ズラリと並ぶ未完了タスク、真っ赤な通知バッジ…。予定を管理しているはずが、予定を見るだけで圧倒され、かえって疲弊してしまいます。」'
  },
  {
    num: 3,
    badge: '課題の本質 (注意残余)',
    title: '集中力を奪う最大の敵「注意残余 (Attention Residue)」',
    visual: 'カレンダーの背景が深くボカされ、中央に「注意残余」の警告文字がネオン発光で鋭く浮かび上がります。',
    script: '「これには心理学的な名前があります。『注意残余（Attention Residue）』です。未完了のタスクが頭の片隅に居座り続けることで、今やるべき作業に使えるはずの脳の認知資源が、知らず知らずのうちに奪われてしまう現象です。」'
  },
  {
    num: 4,
    badge: 'ペルソナ & 受容',
    title: 'やることが多すぎて余裕がない、それでいい。',
    visual: '左側の3つのバッテリーが上から順にエネルギー充填されていきます。最後に右側に『それでいい。』という大きな温かい金色の文字が出現します。',
    script: '「やることが多すぎて余裕がない日、メンタルが崩れて動けない日、そもそもキャパが小さい日…。私たちは『それでもいい。』と全力で肯定したい。大切なのは、自分を責めることではなく、今の自分のキャパシティを受け入れることです。」'
  },
  {
    num: 5,
    badge: '解決アプローチ',
    title: '情報を整理するのではなく、不要なノイズを「隠す（引き算）」',
    visual: '左側の混沌とした予定が中央の矢印を通り、右側の『トットへお供えで貰う』というたった1件の美しいチェックカードへ劇的に収束します。',
    script: '「そこで私たちは、情報を分類して整理するのではなく、不要なノイズを『隠す（引き算）』というアプローチを取りました。今やるべきこと以外のすべての視覚情報を隠蔽し、今この瞬間だけに集中させます。」'
  },
  {
    num: 6,
    badge: 'AI診断モデル',
    title: '心の余裕 × 課題危険度 ＝ 今日やるべきこと最大1件',
    visual: 'iPhoneモックアップが左に表示され、右側で『心の余裕』×『シラバス危険度』＝『今日やるべき1件』の方程式が滑らかにフェードインします。',
    script: '「それを支えるのが、今回開発した『単位死守 ＆ メンタル診断AI』です。あなたの今日の心の余裕と、大学のシラバスから計算された課題危険度をAIが掛け合わせ、今日やるべきこと最大1件を厳選します。限界の日は、容赦なく休養をレコメンドします。」'
  },
  {
    num: 7,
    badge: 'ポジショニングマップ',
    title: '既存アプリとの決定的なポジショニングの差異',
    visual: 'グラフの軸が描画され、GoogleカレンダーやTodoistなどの競合が配置された後、右下にCircadianが金色の太陽コロナをまとって劇的に表示されます。',
    script: '「競合と比較すると一目瞭然です。既存のカレンダーは情報が多くて圧倒され、ToDoリストは時間感覚がありません。Circadianは『時間認知』と『行動支援』を完全に融合し、極限まで情報量を絞り込んだ唯一無二のポジションに位置します。」'
  },
  {
    num: 8,
    badge: 'デモ実演',
    title: '【LIVE DEMO】 実際に動作するアプリ画面の実演',
    visual: '黒い背景に巨大な銀色のネオン文字で『LIVE DEMO』がゆっくりと鼓動するように脈打ちます。実機の画面へ注目を集めます。',
    script: '「それでは、実際にその操作性と、心の余裕ボタンによってタスクの優先順位がパッと切り替わる様子をデモでご覧ください。」'
  },
  {
    num: 9,
    badge: 'プロダクトの哲学',
    title: 'スケジュールを管理するのではなく、私たちの「今」を取り戻す',
    visual: '明朝体の上品なフォントで『頑張れない日があっていい。』が表示され、最後に金色の力強い輝きとともに結びの哲学メッセージが出現します。',
    script: '「頑張れない日があっていい。全部できなくていい。私たちは、時間をきっちり予定で埋めるためのツールを作りたかったのではありません。スケジュールに支配される毎日から、私たちの『今』という時間を取り戻すためにCircadianを作りました。」'
  },
  {
    num: 10,
    badge: '結び',
    title: 'ご清聴ありがとうございました！',
    visual: '最初のCHRONOSのロゴと、デモのQRコードおよびGitHub Pagesのプロダクト公開URLが大きく美しく表示されます。',
    script: '「情報過多の時代に、自分だけの心地よいリズムを刻みましょう。今すぐ体験できる公開URLも用意しています。ご静聴ありがとうございました！」'
  }
];

const CompetitiveAnalysis: React.FC<{ onViewChange: () => void }> = ({ onViewChange }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'direct' | 'indirect' | 'matrix' | 'matchup' | 'slides'>('overview');
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor>(COMPETITORS[0]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard navigation for slides
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'slides') return;
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, 10));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 1));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // For Positioning Map grid lines
  const xGridLines = [25, 50, 75];
  const yGridLines = [25, 50, 75];

  return (
    <div className="comp-hub animate-fade-in">
      {/* Sub Header / Control Bar */}
      <div className="comp-hub__header">
        <div>
          <h2 className="text-headline-lg font-bold" style={{ color: 'var(--color-primary)' }}>
            📊 競合分析 ＆ プレゼン戦略ハブ
          </h2>
          <p className="text-body-md text-on-surface-variant">
            ハッカソン評価基準（hilyuoka.txt）を完全に満たす、Circadianの独自性とポジショニングの証明
          </p>
        </div>
        <button className="comp-hub__back-btn" onClick={onViewChange}>
          <span className="material-symbols-outlined">schedule</span>
          <span>スケジューラーに戻る</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="comp-hub__tabs" aria-label="競合分析のナビゲーション">
        <button
          className={`comp-hub__tab-btn ${activeTab === 'overview' ? 'comp-hub__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="material-symbols-outlined">bubble_chart</span>
          <span>総合ポジショニング</span>
        </button>
        <button
          className={`comp-hub__tab-btn ${activeTab === 'direct' ? 'comp-hub__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('direct')}
        >
          <span className="material-symbols-outlined">donut_large</span>
          <span>直接競合 (円形時間)</span>
        </button>
        <button
          className={`comp-hub__tab-btn ${activeTab === 'indirect' ? 'comp-hub__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('indirect')}
        >
          <span className="material-symbols-outlined">view_agenda</span>
          <span>間接・先進競合</span>
        </button>
        <button
          className={`comp-hub__tab-btn ${activeTab === 'matrix' ? 'comp-hub__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          <span className="material-symbols-outlined">grid_on</span>
          <span>機能比較表</span>
        </button>
        <button
          className={`comp-hub__tab-btn ${activeTab === 'matchup' ? 'comp-hub__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('matchup')}
        >
          <span className="material-symbols-outlined">fact_check</span>
          <span>ハッカソン評価適合</span>
        </button>
        <button
          className={`comp-hub__tab-btn ${activeTab === 'slides' ? 'comp-hub__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('slides')}
        >
          <span className="material-symbols-outlined">slideshow</span>
          <span>プレゼン構成案</span>
        </button>
      </nav>

      {/* Tab Content Area */}
      <div className="comp-hub__content">
        {/* Tab 1: POSITIONING MAP */}
        {activeTab === 'overview' && (
          <div className="comp-overview animate-fade-in">
            <div className="comp-overview__map-section">
              <div className="comp-overview__map-title-box">
                <span className="text-label-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                  🎯 2Dポジショニング空間
                </span>
                <p className="text-label-sm text-on-surface-variant">
                  ノードをクリックすると、右側に詳細な分析データが表示されます。
                </p>
              </div>

              {/* Quadrant Visual Canvas */}
              <div className="pos-map">
                {/* Axes Labels */}
                <div className="pos-map__axis-label pos-map__axis-label--top">情報過多・複雑（高認知負荷）</div>
                <div className="pos-map__axis-label pos-map__axis-label--bottom">情報削減・シンプル（高集中）</div>
                <div className="pos-map__axis-label pos-map__axis-label--left">過去の記録 ＆ 振り返り</div>
                <div className="pos-map__axis-label pos-map__axis-label--right">未来の行動支援・タスク実行</div>

                {/* Grid Lines */}
                {xGridLines.map((line) => (
                  <div key={`x-${line}`} className="pos-map__grid-line pos-map__grid-line--v" style={{ left: `${line}%` }} />
                ))}
                {yGridLines.map((line) => (
                  <div key={`y-${line}`} className="pos-map__grid-line pos-map__grid-line--h" style={{ top: `${line}%` }} />
                ))}

                {/* Quadrant Name overlays */}
                <div className="pos-map__quad-name pos-map__quad-name--tl">ログ・カレンダー型</div>
                <div className="pos-map__quad-name pos-map__quad-name--tr">多機能タスク管理・Grid</div>
                <div className="pos-map__quad-name pos-map__quad-name--bl">自己分析・健康管理</div>
                <div className="pos-map__quad-name pos-map__quad-name--br">直感的行動支援 (Circadian!)</div>

                {/* Center dot */}
                <div className="pos-map__center-dot" />

                {/* Competitor Nodes */}
                {COMPETITORS.map((comp) => {
                  const isActive = selectedCompetitor.id === comp.id;
                  return (
                    <button
                      key={comp.id}
                      className={`pos-map__node ${comp.isCircadian ? 'pos-map__node--circadian' : ''} ${isActive ? 'pos-map__node--active' : ''}`}
                      style={{
                        left: `${comp.x}%`,
                        top: `${100 - comp.y}%`, // invert Y because in CSS top=0 is top of screen, but our y=100 is top (low load)
                      }}
                      onClick={() => setSelectedCompetitor(comp)}
                      aria-label={`${comp.name}の分析を見る`}
                    >
                      <span className="pos-map__node-dot" />
                      <span className="pos-map__node-name">{comp.jpName || comp.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sidebar Details Card */}
            <div className="comp-overview__details-section">
              <div className={`comp-detail-card ${selectedCompetitor.isCircadian ? 'comp-detail-card--circadian' : ''}`}>
                <div className="comp-detail-card__header">
                  <div>
                    <span className={`comp-detail-card__badge ${selectedCompetitor.type === 'direct' ? 'comp-detail-card__badge--direct' : 'comp-detail-card__badge--indirect'}`}>
                      {selectedCompetitor.type === 'direct' ? '直接競合 (24h円形)' : '間接競合 (カレンダー/Todo)'}
                    </span>
                    <h3 className="text-headline-md font-bold mt-1">{selectedCompetitor.name}</h3>
                  </div>
                  {selectedCompetitor.isCircadian && <span className="material-symbols-outlined comp-detail-card__gold-star">stars</span>}
                </div>

                <div className="comp-detail-card__body">
                  <div className="comp-detail-card__field">
                    <span className="text-label-sm text-on-surface-variant font-bold">基本哲学 / アプローチ</span>
                    <p className="text-body-md mt-1 text-on-surface">{selectedCompetitor.philosophy}</p>
                  </div>

                  <div className="comp-detail-card__field mt-4">
                    <span className="text-label-sm text-on-surface-variant font-bold" style={{ color: 'var(--color-primary)' }}>
                      【強み / 評価されている点】
                    </span>
                    <ul className="comp-detail-card__list mt-1">
                      {selectedCompetitor.strengths.map((str, idx) => (
                        <li key={idx} className="text-body-md text-on-surface">
                          <span className="material-symbols-outlined text-green-500 mr-1" style={{ fontSize: '16px', color: '#22C55E', verticalAlign: 'middle' }}>check_circle</span>
                          {str}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedCompetitor.weaknesses.length > 0 && (
                    <div className="comp-detail-card__field mt-4">
                      <span className="text-label-sm text-on-surface-variant font-bold" style={{ color: 'var(--color-error)' }}>
                        【弱み / 致命的な課題】
                      </span>
                      <ul className="comp-detail-card__list mt-1">
                        {selectedCompetitor.weaknesses.map((weak, idx) => (
                          <li key={idx} className="text-body-md text-on-surface">
                            <span className="material-symbols-outlined text-red-500 mr-1" style={{ fontSize: '16px', color: '#EF4444', verticalAlign: 'middle' }}>cancel</span>
                            {weak}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="comp-detail-card__divider my-4" />

                  <div className="comp-detail-card__field">
                    <span className="text-label-sm text-on-surface-variant font-bold" style={{ color: 'var(--color-secondary)' }}>
                      {selectedCompetitor.isCircadian ? '🌟 当社が提唱する競合優位性' : '🛡️ Circadianはどう乗り越えるか (差別化要素)'}
                    </span>
                    <p className="text-body-md mt-1 font-semibold text-on-surface" style={{ lineHeight: '1.5' }}>{selectedCompetitor.edge}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: DIRECT COMPETITORS */}
        {activeTab === 'direct' && (
          <div className="comp-cards-grid animate-fade-in">
            {COMPETITORS.filter(c => c.type === 'direct' && !c.isCircadian).map(comp => (
              <div key={comp.id} className="comp-card">
                <div className="comp-card__header">
                  <h3 className="text-headline-md font-bold text-primary">{comp.name}</h3>
                  <span className="comp-card__badge">直接競合 (円形)</span>
                </div>
                <div className="comp-card__body">
                  <p className="text-body-md text-on-surface-variant italic mb-3">「{comp.philosophy}」</p>
                  
                  <div className="comp-card__section">
                    <h4 className="text-label-sm font-bold text-green-400">👍 強み</h4>
                    <ul className="comp-card__list">
                      {comp.strengths.map((s, idx) => <li key={idx} className="text-body-md">{s}</li>)}
                    </ul>
                  </div>

                  <div className="comp-card__section mt-3">
                    <h4 className="text-label-sm font-bold text-red-400">⚠️ 弱み</h4>
                    <ul className="comp-card__list">
                      {comp.weaknesses.map((w, idx) => <li key={idx} className="text-body-md">{w}</li>)}
                    </ul>
                  </div>

                  <div className="comp-card__divider my-3" />

                  <div className="comp-card__edge">
                    <span className="text-label-sm font-bold text-secondary">✨ Circadianによる車輪の再発明の回避</span>
                    <p className="text-body-md mt-1 font-medium">{comp.edge}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: INDIRECT COMPETITORS */}
        {activeTab === 'indirect' && (
          <div className="comp-cards-grid animate-fade-in">
            {COMPETITORS.filter(c => c.type === 'indirect').map(comp => (
              <div key={comp.id} className="comp-card">
                <div className="comp-card__header">
                  <h3 className="text-headline-md font-bold text-primary">{comp.name}</h3>
                  <span className="comp-card__badge comp-card__badge--indirect">間接競合</span>
                </div>
                <div className="comp-card__body">
                  <p className="text-body-md text-on-surface-variant italic mb-3">「{comp.philosophy}」</p>
                  
                  <div className="comp-card__section">
                    <h4 className="text-label-sm font-bold text-green-400">👍 強み</h4>
                    <ul className="comp-card__list">
                      {comp.strengths.map((s, idx) => <li key={idx} className="text-body-md">{s}</li>)}
                    </ul>
                  </div>

                  <div className="comp-card__section mt-3">
                    <h4 className="text-label-sm font-bold text-red-400">⚠️ 弱み</h4>
                    <ul className="comp-card__list">
                      {comp.weaknesses.map((w, idx) => <li key={idx} className="text-body-md">{w}</li>)}
                    </ul>
                  </div>

                  <div className="comp-card__divider my-3" />

                  <div className="comp-card__edge">
                    <span className="text-label-sm font-bold text-secondary">✨ Circadianによる車輪の再発明の回避</span>
                    <p className="text-body-md mt-1 font-medium">{comp.edge}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: COMPARISON MATRIX */}
        {activeTab === 'matrix' && (
          <div className="comp-matrix-container animate-fade-in">
            <div className="comp-matrix__intro">
              <span className="text-headline-md font-bold text-primary">📊 機能比較マトリクス</span>
              <p className="text-body-md text-on-surface-variant mt-1">
                24時間表現・タスク管理・認知負荷削減を同時に満たすのは**Circadian**だけであることを証明します。
              </p>
            </div>
            
            <div className="comp-matrix-scroll">
              <table className="comp-matrix">
                <thead>
                  <tr>
                    <th>対象アプリ</th>
                    <th>24h円形可視化</th>
                    <th>タスク完了管理</th>
                    <th>「今」の1件集中</th>
                    <th>時間感覚・生体リズム</th>
                    <th>運用の低ストレス性</th>
                    <th>無料＆Web対応</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="comp-matrix__row-circadian">
                    <td className="comp-matrix__app-name font-bold">Circadian (本製品)</td>
                    <td className="comp-matrix__val-best">◎ (タイムアーク)</td>
                    <td className="comp-matrix__val-best">◎ (完了タップ)</td>
                    <td className="comp-matrix__val-best">◎ (現在タスク判定)</td>
                    <td className="comp-matrix__val-best">◎ (シーカー搭載)</td>
                    <td className="comp-matrix__val-best">◎ (0.5秒起動・1ボタン)</td>
                    <td className="comp-matrix__val-best">◎ (完全無料・Web)</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">Sectograph</td>
                    <td>◎ (カレンダー投影)</td>
                    <td>❌ なし</td>
                    <td>❌ なし</td>
                    <td>◯ カレンダー同期のみ</td>
                    <td>△ カレンダー入力の壁</td>
                    <td>△ 一部有料</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">一日予定表</td>
                    <td>◎ (静的円グラフ)</td>
                    <td>△ ログ記録のみ</td>
                    <td>❌ なし</td>
                    <td>❌ 動的針なし</td>
                    <td>◯ 手動入力は楽</td>
                    <td>△ 広告あり</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">Kurun</td>
                    <td>◎ (グラフィカル円)</td>
                    <td>❌ なし</td>
                    <td>❌ なし</td>
                    <td>◯ 生活リズム把握</td>
                    <td>◯ シンプルな使い心地</td>
                    <td>△ 広告・一部有料</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">Owaves</td>
                    <td>◎ (8カテゴリ24h)</td>
                    <td>❌ checklistなし</td>
                    <td>❌ なし</td>
                    <td>◎ 医師監修リズム</td>
                    <td>◯ 美しいがiOSのみ</td>
                    <td>◯ 基本無料</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">Structured</td>
                    <td>❌ 縦線タイムライン</td>
                    <td>◎ タスク・サブタスク</td>
                    <td>❌ 予定がズラリ並ぶ</td>
                    <td>◯ カウントダウンあり</td>
                    <td>◯ 触り心地は極上</td>
                    <td>❌ Proはサブスク</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">Sunsama</td>
                    <td>❌ カレンダーGrid</td>
                    <td>◎ 多機能タスク</td>
                    <td>◯ 朝夕の計画制限</td>
                    <td>◯ 働きすぎ防止</td>
                    <td>❌ 設定・運用の摩擦大</td>
                    <td>❌ 月$16〜$20</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">Tiimo</td>
                    <td>❌ 縦線 / カウント円</td>
                    <td>◯ ルーチン中心</td>
                    <td>◎ カウントダウン</td>
                    <td>◯ ADHD感覚に寄り添い</td>
                    <td>◯ アイコン主体の快適さ</td>
                    <td>❌ 完全有料</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">Rise Science</td>
                    <td>❌ エネルギー波のみ</td>
                    <td>❌ なし</td>
                    <td>❌ なし</td>
                    <td>◎ 生体科学リズム</td>
                    <td>◯ 睡眠計自動計測</td>
                    <td>❌ 完全有料</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">Google カレンダー</td>
                    <td>❌ 縦グリッド</td>
                    <td>◯ ToDoリスト統合</td>
                    <td>❌ 全予定が見える</td>
                    <td>❌ なし</td>
                    <td>❌ 入力項目が多く億劫</td>
                    <td>◎ 完全無料</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">Todoist</td>
                    <td>❌ テキストリスト</td>
                    <td>◎ 階層タスク</td>
                    <td>❌ リストが溜まる</td>
                    <td>❌ なし</td>
                    <td>◯ 自然言語入力は快適</td>
                    <td>△ 高度機能は有料</td>
                  </tr>
                  <tr>
                    <td className="comp-matrix__app-name">TickTick</td>
                    <td>❌ カレンダー/リスト</td>
                    <td>◎ 万能タスク</td>
                    <td>❌ 多機能すぎて迷う</td>
                    <td>◯ ポモドーロ連動</td>
                    <td>△ 機能過多の圧迫感</td>
                    <td>△ カレンダー同期は有料</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: HACKATHON EVALUATION MATCHUP */}
        {activeTab === 'matchup' && (
          <div className="comp-matchup animate-fade-in">
            <div className="comp-matchup__intro">
              <span className="text-headline-md font-bold text-primary">📐 ハッカソン評価基準の攻略（hilyuoka.txt）</span>
              <p className="text-body-md text-on-surface-variant mt-1">
                審査基準の配点要素に対して、本製品がどのように満点を狙う設計になっているかを示します。
              </p>
            </div>

            <div className="comp-matchup__grid">
              <div className="matchup-card">
                <div className="matchup-card__header">
                  <span className="matchup-card__num">01</span>
                  <h3 className="text-headline-md font-bold">1. 課題設定</h3>
                </div>
                <div className="matchup-card__body">
                  <div className="matchup-card__criteria">
                    <span className="text-label-sm font-bold text-primary">【評価ポイント】</span>
                    <p className="text-body-md">課題の深さ、多角的な視点、ターゲット（誰に利用してもらうか）の明確さ。</p>
                  </div>
                  <div className="matchup-card__divider my-3" />
                  <div className="matchup-card__solution">
                    <span className="text-label-sm font-bold text-secondary">【本製品の対応】</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「タスク管理ツールの情報量に圧倒されて挫折し、先延ばしグセのある大学生」にペルソナを完全固定。
                      単に「予定を忘れる」ことではなく、**「予定が多すぎて脳がフリーズする（認知負荷）」**および**「予定がリスト形式なので時間の有限性が掴めない（時間認知）」**の2つの深い精神心理学的課題を突く設計。
                    </p>
                  </div>
                </div>
              </div>

              <div className="matchup-card">
                <div className="matchup-card__header">
                  <span className="matchup-card__num">02</span>
                  <h3 className="text-headline-md font-bold">2. 独創性</h3>
                </div>
                <div className="matchup-card__body">
                  <div className="matchup-card__criteria">
                    <span className="text-label-sm font-bold text-primary">【評価ポイント】</span>
                    <p className="text-body-md">アイデアの斬新さ、当事者意識（自分達ならでは）、競合優位性（車輪の再発明の回避）。</p>
                  </div>
                  <div className="matchup-card__divider my-3" />
                  <div className="matchup-card__solution">
                    <span className="text-label-sm font-bold text-secondary">【本製品の対応】</span>
                    <p className="text-body-md font-medium text-on-surface">
                      自分たち自身が「課題を先延ばしにしてしまう当事者」であるという強い説得力。
                      Sectograph（タスク管理なし）、一日予定表（過去ログ用）、Todoist（時間感覚なし）の隙間を完璧に縫い、**「カレンダーとToDoを24時間ダイヤルに溶かし込み、今やることだけを浮き彫りにする」**という完全な独自ポジションの確立。
                    </p>
                  </div>
                </div>
              </div>

              <div className="matchup-card">
                <div className="matchup-card__header">
                  <span className="matchup-card__num">03</span>
                  <h3 className="text-headline-md font-bold">3. 実現可能性</h3>
                </div>
                <div className="matchup-card__body">
                  <div className="matchup-card__criteria">
                    <span className="text-label-sm font-bold text-primary">【評価ポイント】</span>
                    <p className="text-body-md">技術的・現実的な実行イメージ。AIを活用し、1人でも実際に動く画面を完成させているか（満点条件）。</p>
                  </div>
                  <div className="matchup-card__divider my-3" />
                  <div className="matchup-card__solution">
                    <span className="text-label-sm font-bold text-secondary">【本製品の対応】</span>
                    <p className="text-body-md font-medium text-on-surface">
                      Vite + React (TypeScript) で構築された**完全動作するアプリケーションUI**。
                      モックアップや画像だけではなく、実際にタスクを追加でき、24時間時計にリアルタイムで扇形（アーク）が描画され、現在時刻のシーカーが光り、完了ボタンでトースト通知とタスク切り替えが走る、プレゼン時にデモが完璧に動く状態。
                    </p>
                  </div>
                </div>
              </div>

              <div className="matchup-card">
                <div className="matchup-card__header">
                  <span className="matchup-card__num">04</span>
                  <h3 className="text-headline-md font-bold">4. プレゼン</h3>
                </div>
                <div className="matchup-card__body">
                  <div className="matchup-card__criteria">
                    <span className="text-label-sm font-bold text-primary">【評価ポイント】</span>
                    <p className="text-body-md">必須要素（課題・ターゲット・独創性・デモ）の網羅、資料の見やすさ、熱意。</p>
                  </div>
                  <div className="matchup-card__divider my-3" />
                  <div className="matchup-card__solution">
                    <span className="text-label-sm font-bold text-secondary">【本製品の対応】</span>
                    <p className="text-body-md font-medium text-on-surface">
                      アプリ内に完全に洗練されたプレゼン構成スライド台本（タブ6）を内蔵。
                      文字情報を削ぎ落とし、ダークモードで目に優しく、かつ第一印象で「クオリティが高くてヤバい」と審査員を惹きつける極めて premium なデザイントークン設計。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: SLIDE DECK PRESENTATION SCRIPT */}
        {activeTab === 'slides' && (
          <div className="comp-slides animate-fade-in">
            <div className="comp-slides__header-box">
              <div>
                <span className="text-headline-md font-bold text-primary">📊 登壇用インタラクティブ・プレゼンプレイヤー</span>
                <p className="text-body-md text-on-surface-variant mt-1">
                  キーボードの <code>←</code> <code>→</code> キーや <code>Space</code> キーでスライドを操作できます。ハッカソンのピッチに最適なアニメーション演出を搭載。
                </p>
              </div>
              <div className="comp-slides__controls">
                <button 
                  className={`fullscreen-toggle-btn ${isFullscreen ? 'active' : ''}`}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <span className="material-symbols-outlined">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
                  <span>{isFullscreen ? '全画面終了' : '全画面表示'}</span>
                </button>
              </div>
            </div>

            {/* Slide Projector Canvas */}
            <div className={`slide-projector ${isFullscreen ? 'slide-projector--fullscreen' : ''}`}>
              <div className="slide-projector__viewport">
                
                {/* SLIDE 1: Title CHRONOS */}
                {currentSlide === 1 && (
                  <div className="slide-content slide-content--title animate-fade-in">
                    <div className="slide-title-bg-clock" />
                    <div className="slide-glass-card">
                      <h1 className="slide-title-main">CHRONOS</h1>
                      <p className="slide-title-sub">クロノス：24時間周期の可視化アプリ</p>
                      <div className="slide-title-footer">
                        <span>DEVELOPED BY GRYFFINDOR</span>
                        <span className="slide-title-sep">//</span>
                        <span>VER 1.0.4</span>
                        <span className="slide-title-sep">//</span>
                        <span>MAY 2026</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 2: Overload and Notifications */}
                {currentSlide === 2 && (
                  <div className="slide-content slide-content--overload animate-fade-in">
                    <div className="overload-list-mock">
                      <div className="overload-title">My Heavy Tasks Schedule</div>
                      <div className="overload-list-item"><span>■ 授業のレポート提出</span><span className="urgent-tag">重要</span></div>
                      <div className="overload-list-item"><span>■ バイトのシフト提出</span></div>
                      <div className="overload-list-item"><span>■ ゼミの発表準備</span><span className="urgent-tag">やばい</span></div>
                      <div className="overload-list-item"><span>■ 就活ES締め切り</span></div>
                      <div className="overload-list-item"><span>■ 英語のオンライン小テスト</span></div>
                    </div>
                    {/* Floating chaotic notification badges */}
                    <div className="badge-pop badge-pop--1">99+</div>
                    <div className="badge-pop badge-pop--2">50</div>
                    <div className="badge-pop badge-pop--3">124</div>
                  </div>
                )}

                {/* SLIDE 3: Attention Residue */}
                {currentSlide === 3 && (
                  <div className="slide-content slide-content--attention animate-fade-in">
                    <div className="attention-card">
                      <h2 className="attention-glow-title">注意残余<br /><span className="sub-en">(Attention Residue)</span></h2>
                      <p className="attention-glow-text mt-4">
                        タスク管理アプリを開いて、余計に疲れていませんか？<br />
                        未完了のタスクが頭の片隅に居座り、<br />
                        今やるべきことに集中できない現象。
                      </p>
                    </div>
                  </div>
                )}

                {/* SLIDE 4: Battery Capacity */}
                {currentSlide === 4 && (
                  <div className="slide-content slide-content--battery animate-fade-in">
                    <div className="battery-deck">
                      <div className="battery-row fill-100">
                        <div className="battery-case">
                          <div className="battery-liquid" />
                          <span className="battery-num">100%</span>
                        </div>
                        <span className="battery-desc">やることが多すぎて余裕がない</span>
                      </div>
                      
                      <div className="battery-row fill-50 mt-4">
                        <div className="battery-case">
                          <div className="battery-liquid" />
                          <span className="battery-num">50%</span>
                        </div>
                        <span className="battery-desc">精神的な疾患で動けない日がある</span>
                      </div>

                      <div className="battery-row fill-10 mt-4">
                        <div className="battery-case">
                          <div className="battery-liquid" />
                          <span className="battery-num">10%</span>
                        </div>
                        <span className="battery-desc">そもそもキャパが小さい</span>
                      </div>
                    </div>

                    <div className="battery-verdict animate-verdict-glow">
                      <div className="verdict-word">それでいい。</div>
                    </div>
                  </div>
                )}

                {/* SLIDE 5: Subtraction */}
                {currentSlide === 5 && (
                  <div className="slide-content slide-content--subtraction animate-fade-in">
                    <div className="sub-flow">
                      <div className="sub-card-left">
                        <span className="sub-tag sub-tag--gray">整理する前の状態 (情報過多)</span>
                        <div className="mock-list-overload mt-2">
                          <div className="mock-item-blurred" />
                          <div className="mock-item-blurred" />
                          <div className="mock-item-blurred" />
                          <div className="mock-item-blurred" />
                        </div>
                      </div>

                      <div className="sub-arrow-box">
                        <div className="sub-arrow-icon">➔</div>
                        <span className="sub-arrow-label">隠す (引き算)</span>
                      </div>

                      <div className="sub-card-right">
                        <span className="sub-tag sub-tag--green">今やるべきノイズレスな状態</span>
                        <div className="clean-checkbox-card mt-2">
                          <span className="clean-chk">✓</span>
                          <span className="clean-task-txt">トットへお供えで貰う</span>
                        </div>
                      </div>
                    </div>
                    <p className="sub-philosophy text-center mt-4">
                      情報を整理するのではなく、不要なノイズを隠す。
                    </p>
                  </div>
                )}

                {/* SLIDE 6: Dynamic Formula */}
                {currentSlide === 6 && (
                  <div className="slide-content slide-content--formula animate-fade-in">
                    <div className="formula-wrapper">
                      <div className="formula-left-iphone">
                        <div className="iphone-body">
                          <div className="iphone-screen-mock">
                            <div className="iphone-status">5月23日 (土) 16:50</div>
                            <div className="iphone-circle-dial">
                              <div className="dial-glow-arc" />
                              <div className="dial-seeker" />
                            </div>
                            <div className="iphone-footer-task">ハッカソン開発</div>
                          </div>
                        </div>
                      </div>

                      <div className="formula-right-math">
                        <div className="math-row">
                          <div className="math-block block-battery">
                            <span>🔋 今日の心の余裕 (😊/😐/😫)</span>
                          </div>
                          <span className="math-op">×</span>
                          <div className="math-block block-syllabus">
                            <span>⚠️ シラバスの締切・単位危機度</span>
                          </div>
                        </div>
                        <div className="math-equals">＝</div>
                        <div className="math-result">
                          <span>【 🎯 今日やるべき1件 】</span>
                        </div>
                        <p className="math-desc mt-3">
                          しんどい日は「今日は休んでOK」。締め切りが迫っていれば「これだけはやろう」。心の余裕と締め切りを掛け合わせ、AIが自動で抽出。
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 7: 2D Position Map */}
                {currentSlide === 7 && (
                  <div className="slide-content slide-content--positioning animate-fade-in">
                    <div className="map-view-box">
                      <div className="map-view-title">🎯 ポジショニングマップ</div>
                      <div className="map-canvas">
                        {/* Axes */}
                        <div className="map-axis map-axis--y">情報量 (多 ➔ 少)</div>
                        <div className="map-axis map-axis--x">全体俯瞰 ➔ 今への集中</div>
                        
                        {/* Nodes */}
                        <div className="map-node node-gray gc">Google Calendar</div>
                        <div className="map-node node-gray td">Todoist</div>
                        <div className="map-node node-gray tt">TickTick</div>
                        <div className="map-node node-gray kr">Kurun</div>
                        <div className="map-node node-gray yp">一日予定表</div>
                        
                        {/* Circadian solar eclipse glow */}
                        <div className="map-node node-circadian-eclipse">
                          <div className="eclipse-glowing-ring" />
                          <span className="circadian-text">Circadian</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE 8: LIVE DEMO */}
                {currentSlide === 8 && (
                  <div className="slide-content slide-content--livedemo animate-fade-in">
                    <h1 className="live-demo-glow-text">LIVE DEMO</h1>
                  </div>
                )}

                {/* SLIDE 9: Closing */}
                {currentSlide === 9 && (
                  <div className="slide-content slide-content--closing animate-fade-in">
                    <h2 className="closing-headline">
                      頑張れない日があっていい。<br />
                      全部できなくていい。
                    </h2>
                    <h3 className="closing-sub-glow mt-4">
                      スケジュールを管理するのではなく、<br />
                      私たちの「今」を取り戻す。
                    </h3>
                  </div>
                )}

                {/* SLIDE 10: Final Logo */}
                {currentSlide === 10 && (
                  <div className="slide-content slide-content--title slide-content--final animate-fade-in">
                    <div className="slide-title-bg-clock" />
                    <div className="slide-glass-card">
                      <h1 className="slide-title-main">CHRONOS</h1>
                      <p className="slide-title-sub">ご清聴ありがとうございました！</p>
                      <div className="slide-final-qr mt-4">
                        <div className="mock-qr-draw">
                          <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#ffffff' }}>qr_code_2</span>
                        </div>
                        <p className="text-label-sm text-primary mt-2">https://taku010201040.github.io/nowtask/</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Left/Right Click Overlays to navigate on touch/click */}
                <div className="slide-clicker slide-clicker--left" onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))} title="前へ" />
                <div className="slide-clicker slide-clicker--right" onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, 10))} title="次へ" />
              </div>

              {/* Slider Bottom Bar control */}
              <div className="slide-projector__bar">
                <button 
                  className="slide-bar-btn"
                  onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 1))}
                  disabled={currentSlide === 1}
                >
                  <span className="material-symbols-outlined">navigate_before</span>
                  <span>PREV</span>
                </button>

                <div className="slide-dots">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <button
                      key={idx}
                      className={`slide-dot ${currentSlide === idx + 1 ? 'slide-dot--active' : ''}`}
                      onClick={() => setCurrentSlide(idx + 1)}
                      aria-label={`スライド ${idx + 1} へ`}
                    />
                  ))}
                </div>

                <button 
                  className="slide-bar-btn"
                  onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, 10))}
                  disabled={currentSlide === 10}
                >
                  <span>NEXT</span>
                  <span className="material-symbols-outlined">navigate_next</span>
                </button>
              </div>
            </div>

            {/* PRESENTATION SPEAKER NOTES / TELEPROMPTER */}
            <div className="speaker-notes mt-4 animate-slide-up">
              <div className="speaker-notes__header">
                <span className="material-symbols-outlined text-secondary">record_voice_over</span>
                <span className="text-label-lg font-bold text-secondary">
                  登壇発表用 カンペ・トークスクリプト (スライド {currentSlide} / 10)
                </span>
              </div>
              
              <div className="speaker-notes__body mt-2">
                <div className="notes-section">
                  <span className="notes-tag notes-tag--visual">🎨 視覚イメージ ➔</span>
                  <p className="text-body-md text-on-surface">
                    {SLIDE_NOTES[currentSlide - 1].visual}
                  </p>
                </div>

                <div className="notes-section mt-3">
                  <span className="notes-tag notes-tag--script">🎤 トーク台本 (熱意を込めて) ➔</span>
                  <p className="text-body-lg text-primary font-bold italic" style={{ lineHeight: '1.6', color: 'var(--color-primary)' }}>
                    "{SLIDE_NOTES[currentSlide - 1].script}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompetitiveAnalysis;
