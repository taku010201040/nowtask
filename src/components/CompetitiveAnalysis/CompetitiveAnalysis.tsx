import React, { useState } from 'react';
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

const CompetitiveAnalysis: React.FC<{ onViewChange: () => void }> = ({ onViewChange }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'direct' | 'indirect' | 'matrix' | 'matchup' | 'slides'>('overview');
  const [selectedCompetitor, setSelectedCompetitor] = useState<Competitor>(COMPETITORS[0]);

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
                <span className="text-headline-md font-bold text-primary">📢 ハッカソン本番用スライド台本 ＆ 演出</span>
                <p className="text-body-md text-on-surface-variant mt-1">
                  制限時間3〜5分のハッカソンプレゼンで、審査員の心を掴み満点を勝ち取るための最強のピッチ構成案です。
                </p>
              </div>
              <button 
                className="comp-hub__back-btn" 
                style={{ background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(COMPETITORS, null, 2));
                  alert('競合分析のローデータ（JSON）をクリップボードにコピーしました！プレゼン作成ツール等への流し込みにご利用ください。');
                }}
              >
                <span className="material-symbols-outlined">content_copy</span>
                <span>競合データをコピー</span>
              </button>
            </div>

            <div className="comp-slides__deck">
              <div className="slide-sheet">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 1 / 10</span>
                  <span className="slide-sheet__title-badge">タイトル</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">開いた瞬間に"今"がわかる — 24時間スケジューラー 「Circadian」</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">ダークテーマで浮かび上がる美しい24時間円形時計。中央のシーカーが妖しく光る高クオリティ画面キャプチャを背景に大きく配置。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (熱意を込めて)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「皆さん、こんにちは。私たちは『情報過多の時代に、瞬時に今やるべきことに没頭できる』アプリ、Circadian（サーカディアン）を開発しました。開いた瞬間にすべてが伝わる、私たちの自信作をご覧ください。」
                    </p>
                  </div>
                </div>
              </div>

              <div className="slide-sheet mt-4">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 2 / 10</span>
                  <span className="slide-sheet__title-badge">課題提起</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">なぜ私たちは、やるべきことを先延ばしにしてしまうのか？</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">「73%の大学生が課題を先延ばしにしている」という統計グラフ。従来の複雑なカレンダーに予定がぎっしり詰まって圧倒されているイメージ図。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (問いかけるように)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「私たちは3つのアプローチからこの問題の本質を突き止めました。第1に『認知負荷』。既存のアプリは今日の全予定を画面に並べるため、それを見た瞬間に圧倒されて脳が拒絶してしまいます。第2に『時間認知』。リスト形式の予定表では、今日の残り時間の感覚が掴めません。第3に『操作コスト』。入力が面倒なスケジュール帳は、挫折の原因になります。」
                    </p>
                  </div>
                </div>
              </div>

              <div className="slide-sheet mt-4">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 3 / 10</span>
                  <span className="slide-sheet__title-badge">ターゲット & ペルソナ</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">「予定はカレンダーに入れるけれど、結局見ない」大学生</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">ペルソナ：大学3年生・ハッカソン参加者。サークル、就活、バイト、大学の課題が同時進行し、やることが分かっているのに何から手をつければいいか迷っている様子。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (当事者意識を出して)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「ターゲットは、私たち自身です。意識が高くてカレンダーに予定は書き留めるものの、情報量が多くてアプリを開くこと自体がストレスになってしまった人。私たちが本当に使いたい、無駄を削ぎ落としたツールが必要です。」
                    </p>
                  </div>
                </div>
              </div>

              <div className="slide-sheet mt-4">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 4 / 10</span>
                  <span className="slide-sheet__title-badge">解決策 & コア価値</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">情報を極限まで『削る』アプローチ：「今、これだけをやれ」</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">「一般的なカレンダー ＝ すべてを管理（複雑）」と「Circadian ＝ 今だけに集中（シンプル）」の対比図。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (力強く)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「私たちが提案するのは、予定を増やすことではなく、『減らす』ことです。Circadianを起動すると、0.5秒で自動的に『今進行中のタスク』または『次に行うべき最優先タスク』が画面に大きく1件だけ浮かび上がります。迷う時間をゼロにします。」
                    </p>
                  </div>
                </div>
              </div>

              <div className="slide-sheet mt-4">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 5 / 10</span>
                  <span className="slide-sheet__title-badge">競合分析</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">既存カレンダー・ToDoリストとのポジショニングの違い</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">本ダッシュボードの「総合ポジショニングマップ」と同様の、4象限ポジショニング図。Circadianが右下の独自の領域にいることを明確に示す。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (論理的に論破)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「私たちは徹底的な競合分析を行いました。Sectographなどの円形時計は単なるカレンダーの投影にすぎず、タスクの登録や完了管理ができません。また、Todoistなどのタスクリストは時間の直感性がなく、先延ばしを招きます。Circadianは『円形アナログ時計の残り時間感覚』と『動的なタスク完了チェック』を統合した唯一無二の存在です。」
                    </p>
                  </div>
                </div>
              </div>

              <div className="slide-sheet mt-4">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 6 / 10</span>
                  <span className="slide-sheet__title-badge">デモ実演</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">【ライブデモ】 完璧な時間ブロックと0摩擦のタスク完了</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">実機、またはデモ画面のスクリーントランジション。タスクを追加した瞬間にタイムアークが美しく描画され、チェックで消える様子。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (デモを実演しながら)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「それではデモをご覧ください。ご覧の通り、24時間時計の周りに本日のタスクが色鮮やかな扇形（アーク）で表示されています。現在の時刻を指す針がゆっくりと進み、中央には『今やること』が大きく映し出されています。ここでFABをタップし、『就活エントリーシート』を追加します。ご覧ください、アークがリアルタイムで挿入されました！タスクが完了したらチェック。トーストとともに次のタスクに自動で切り替わります。」
                    </p>
                  </div>
                </div>
              </div>

              <div className="slide-sheet mt-4">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 7 / 10</span>
                  <span className="slide-sheet__title-badge">独自性の秘密</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">当事者だからこその「目に優しく、心に余裕を与える」デザイン</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">こだわりポイントのクローズアップ（夜間に目に痛くない美しいダークマテリアルカラー、残り時間が視覚的に減っていくアークのフェード効果など）。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (共感を呼ぶ)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「なぜこのダークな配色なのか？ 深夜に部屋を暗くして課題をやる学生にとって、明るい画面は目に毒だからです。なぜタスク完了のトーストがこんなに気持ち良いのか？ 達成感のないタスク管理は続かないからです。すべて私たちのリアルな体験とこだわりから決定されました。」
                    </p>
                  </div>
                </div>
              </div>

              <div className="slide-sheet mt-4">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 8 / 10</span>
                  <span className="slide-sheet__title-badge">技術構成</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">Vite + React ＆ リアルタイムSVGアークレンダリング</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">技術構成スタック図（Vite, React, TypeScript, LocalStorage, Vanilla CSS, SVG Drawing engine, GitHub Pages Deploy）。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (技術的裏付け)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「私たちはハッカソン中に実際に動作する画面を完成させるため、ビルドが高速なVite＋Reactを採用しました。特に時計のアーク描画はライブラリに頼らず、ネイティブSVGの数式描画でリアルタイムに処理しており、極めて軽量かつレスポンシブです。データは安全にLocalStorageに永続化されます。」
                    </p>
                  </div>
                </div>
              </div>

              <div className="slide-sheet mt-4">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 9 / 10</span>
                  <span className="slide-sheet__title-badge">今後の拡張ロードマップ</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">Notion同期、画像予定抽出、そして音声による対話的タスク入力へ</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">今後の機能のアイコン並び（Notion MCP、音声入力・Speech-to-Text、AI Visionによるチラシ画像からの自動カレンダー抽出）。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (ワクワク感の提示)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「Circadianはここで終わりません。今後はNotionとの自動双方向同期をサポートし、さらにLLMを用いた音声入力による対話的タスク登録や、授業のシラバス写真から一括で予定を取り込むAI Vision機能を実装し、さらに入力コストを削減します。」
                    </p>
                  </div>
                </div>
              </div>

              <div className="slide-sheet mt-4">
                <div className="slide-sheet__meta">
                  <span className="slide-sheet__num">スライド 10 / 10</span>
                  <span className="slide-sheet__title-badge">結び</span>
                </div>
                <div className="slide-sheet__content">
                  <h4 className="text-headline-sm font-bold text-primary">「『今』に集中できれば、あなたの1日は確実に変わる。」</h4>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎨 視覚イメージ</span>
                    <p className="text-body-md">大きなキャッチフレーズと、GitHub Pagesで今すぐ体験できるデモQRコードの表示。</p>
                  </div>
                  <div className="slide-sheet__section mt-2">
                    <span className="text-label-sm text-on-surface-variant font-bold">🎤 トーク台本 (余韻を残す)</span>
                    <p className="text-body-md font-medium text-on-surface">
                      「情報過多に追われる日々を終わらせ、自分だけの体内時計を取り戻しましょう。今この瞬間から、Circadianがあなたの集中を支えます。ご静聴ありがとうございました！」
                    </p>
                  </div>
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
