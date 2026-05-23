import React, { useState } from 'react';
import './MentalGpaRescue.css';
import { generateId } from '../../utils/constants';
import type { Task } from '../../types';

interface SyllabusTask {
  id: string;
  courseName: string;
  taskName: string;
  daysRemaining: number;
  dangerLevel: string;
  isCritical: boolean; //落単に直結するか
}

interface DiagnosisResult {
  today_task: {
    has_task: boolean;
    title: string;
    reason: string;
  };
  ux_message: string;
}

interface MentalGpaRescueProps {
  onApplyTask: (task: Omit<Task, 'id' | 'date'>) => void;
}

const PRESET_SYLLABUS_TASKS: SyllabusTask[] = [
  {
    id: 'syll-1',
    courseName: '情報処理実習',
    taskName: '最終成果物のプログラミング課題提出',
    daysRemaining: 2,
    dangerLevel: 'この課題を出さないと評価がCからFに落ちる（落単）',
    isCritical: true,
  },
  {
    id: 'syll-2',
    courseName: 'ミクロ経済学',
    taskName: '講義ノートまとめレポート提出',
    daysRemaining: 4,
    dangerLevel: '成績評価の20%を占めるため、GPA維持に必須',
    isCritical: false,
  },
  {
    id: 'syll-3',
    courseName: '英語表現II',
    taskName: 'ショートエッセイ提出',
    daysRemaining: 1,
    dangerLevel: '未提出3回で自動的に不合格（現在2回未提出で崖っぷち）',
    isCritical: true,
  },
  {
    id: 'syll-4',
    courseName: '統計学入門',
    taskName: '中間演習問題プリント提出',
    daysRemaining: 7,
    dangerLevel: '平常点扱いだが、出しておくと期末テストの保険になる',
    isCritical: false,
  }
];

const MentalGpaRescue: React.FC<MentalGpaRescueProps> = ({ onApplyTask }) => {
  // States
  const [mentalStatus, setMentalStatus] = useState<'良い' | '普通' | 'しんどい' | null>(null);
  const [syllabusTasks, setSyllabusTasks] = useState<SyllabusTask[]>(PRESET_SYLLABUS_TASKS);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // New task form states
  const [newCourse, setNewCourse] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newDays, setNewDays] = useState(3);
  const [newDanger, setNewDanger] = useState('');
  const [newIsCritical, setNewIsCritical] = useState(false);

  // Form handler
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse || !newTaskName) return;

    const newTask: SyllabusTask = {
      id: generateId(),
      courseName: newCourse,
      taskName: newTaskName,
      daysRemaining: Number(newDays),
      dangerLevel: newDanger || '平常点に影響あり',
      isCritical: newIsCritical,
    };

    setSyllabusTasks((prev) => [...prev, newTask]);
    // Clear
    setNewCourse('');
    setNewTaskName('');
    setNewDays(3);
    setNewDanger('');
    setNewIsCritical(false);
    setIsFormOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    setSyllabusTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Diagnosis Engine (Implementing user logic and outputs EXACT JSON schema)
  const runDiagnosis = (status: '良い' | '普通' | 'しんどい') => {
    setMentalStatus(status);

    let resultTask: SyllabusTask | null = null;
    let reason = '';
    let ux_message = '';

    if (status === 'しんどい') {
      // 1. 【しんどい】の場合：
      // 締切が「当日」または「翌日」かつ「出さないと落単」の超絶クリティカルなタスクがない限り「なし」
      const criticalTask = syllabusTasks.find(
        (t) => t.daysRemaining <= 2 && t.isCritical
      );

      if (criticalTask) {
        resultTask = criticalTask;
        reason = `締切があと${criticalTask.daysRemaining}日と迫っており、かつ不合格直結（落単危険）の超絶クリティカル状態です。今日これだけは倒す必要があります。`;
        ux_message = `今日はお布団から出るのもきつい状態ですね。診断を開いてくれて本当にえらいです。本当は泥のように眠ってほしいのですが、この『${criticalTask.courseName}』だけは提出を逃すと本当に単位を落としてしまいます…。今日だけは、この課題を「30分だけ」形にするのを目標にしましょう。白紙提出を避けるだけでCは確保できます！これが終わったら、あとはPCを閉じてゆっくり眠りましょう！🛀`;
      } else {
        reason = '直近に落単に直結するような超危険な課題はありません。単位を守るためにも、今日は心身の回復を最優先にすべきです。';
        ux_message = `今日は心身ともに限界ですね。シラバスを逆算した結果、今日提出しないと即留年に直結するような狂気的課題はありません！今日のタスクは「完全になし」です！焦って無理をしても効率は上がりません。今日は罪悪感を1グラムも持たずに、好きな動画を見たりして心を充電してください。単位よりあなたのメンタルの方が100倍大切です！🛌`;
      }
    } else if (status === '普通') {
      // 2. 【普通】の場合：
      // 直近（2〜3日以内）に締切がある「重要度：高（isCriticalまたは残り日数が少ない）」タスクを1件だけ抽出
      const normalTask = syllabusTasks
        .filter((t) => t.daysRemaining <= 3)
        .sort((a, b) => {
          if (a.isCritical && !b.isCritical) return -1;
          if (!a.isCritical && b.isCritical) return 1;
          return a.daysRemaining - b.daysRemaining;
        })[0];

      if (normalTask) {
        resultTask = normalTask;
        reason = `締切があと${normalTask.daysRemaining}日に迫っています。メンタルが「普通」の今、この直近課題を1件だけクリアしておくことで、明日以降の自分に多大な安心感を与えることができます。`;
        ux_message = `今日は可もなく不可もない、平均的なコンディションですね。そういう日こそ、焦らず「直近で一番やばい課題」を1件だけ狙い撃ちして終わらせるのが最適解です！ターゲットは『${normalTask.courseName}』。今日のうちに片付けておけば、明日以降の心の余裕が別次元になります。深く考えず、サクッと1件だけ倒しちゃいましょう！🍀`;
      } else {
        // 直近にやばいタスクがなければ、一番近いタスク
        const closestTask = [...syllabusTasks].sort((a, b) => a.daysRemaining - b.daysRemaining)[0];
        if (closestTask) {
          resultTask = closestTask;
          reason = `現在、2〜3日以内の超緊急タスクはありませんが、少し先にあるこの『${closestTask.courseName}』を今日少しだけ進めておくと、のちの負荷が大幅に分散されます。`;
          ux_message = `直近の締め切りに追われるピンチな課題は、今すべてクリアされています！素晴らしい管理能力ですね。少し先にある『${closestTask.courseName}』に軽く手を付けておくのはいかがでしょうか？今日30%だけでも進めておくと、締め切り前日の泣きながらの徹夜を防げます。未来の自分への貯金だと思って進めてみましょう！😊`;
        } else {
          reason = '現在、提出すべき課題が完全に登録されていません。';
          ux_message = `現在、課題リストが空っぽです！これは素晴らしい状態です。今日は普段通りに過ごして、心穏やかにのんびりした一日を楽しみましょう！`;
        }
      }
    } else {
      // 3. 【良い】の場合：
      // 重要度が高く、または少し先にあるが今日やるとアドバンテージになるものを提案
      const goodTask = [...syllabusTasks].sort((a, b) => {
        const aScore = (a.isCritical ? 10 : 0) + (10 - a.daysRemaining);
        const bScore = (b.isCritical ? 10 : 0) + (10 - b.daysRemaining);
        return bScore - aScore;
      })[0];

      if (goodTask) {
        resultTask = goodTask;
        reason = `心の余裕がたっぷりある今日のあなたなら、締切が少し先の課題であっても完全に圧倒することなく先回りして処理できます。今日終わらせることで圧倒的アドバンテージを獲得できます。`;
        ux_message = `今日のコンディションは最高ですね！エネルギーがみなぎっている無敵のタイミングで、少し先にある『${goodTask.courseName}』を一気に撃破してしまいましょう！心の余裕が良い状態の今なら、面倒なレポートも驚くほどのスピードで終わるはずです。来週のあなたが「過去の自分、マジで神！」と泣いて感謝することになります！🚀`;
      } else {
        reason = '課題リストが完全に空です。';
        ux_message = `なんと、提出が必要な課題が現在ゼロです！文句なしの完全勝利！今日は心の状態も抜群に良いので、課題のことは1秒も考えず、あなたの好きなクリエイティブな活動、趣味に全力で情熱とパワーを注ぎ込みましょう！🎉`;
      }
    }

    const diagnosisResult: DiagnosisResult = {
      today_task: {
        has_task: !!resultTask,
        title: resultTask ? `【${resultTask.courseName}】${resultTask.taskName}` : '',
        reason: reason,
      },
      ux_message: ux_message,
    };

    setDiagnosis(diagnosisResult);
  };

  // Convert recommended task and load it into central schedule!
  const handleApplyToSchedule = () => {
    if (!diagnosis || !diagnosis.today_task.has_task) return;

    const title = diagnosis.today_task.title;
    
    onApplyTask({
      name: title,
      startTime: '16:00',
      endTime: '18:00',
      status: '進行中',
      color: 'orange', // Orange for GPA action!
      tag: 'Study',
      priority: 1,
      memo: diagnosis.today_task.reason,
    });
  };

  return (
    <div className="rescue-hub animate-fade-in">
      {/* Upper header */}
      <div className="rescue-hub__header">
        <div>
          <h2 className="text-headline-lg font-bold" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛡️ 単位死守 ＆ メンタル診断 AI</span>
            <span className="demo-badge">HACKATHON DEMO</span>
          </h2>
          <p className="text-body-md text-on-surface-variant">
            「シラバス逆算の締切危険度」×「あなたの今日の心の余裕」から、今日やるべきこと最大1件を厳選します。
          </p>
        </div>
      </div>

      <div className="rescue-grid">
        {/* Left Side: Setup Conditions */}
        <div className="rescue-setup">
          {/* Section 1: Condition Select */}
          <div className="rescue-card">
            <span className="text-label-lg font-bold text-primary mb-2 display-block">
              1. 今日の心の余裕を選択 (デモでタップ！)
            </span>
            <p className="text-label-sm text-on-surface-variant mb-3">
              心の余裕度をクリックすると、タスクの優先度が一瞬で切り替わるアニメーションが走ります。
            </p>
            <div className="status-selector">
              <button 
                className={`status-card status-card--good ${mentalStatus === '良い' ? 'status-card--active' : ''}`}
                onClick={() => runDiagnosis('良い')}
              >
                <span className="status-card__emoji">😊</span>
                <span className="status-card__title">ゆとりがある</span>
                <span className="status-card__desc">やる気全開！何でもこなせる状態。</span>
              </button>

              <button 
                className={`status-card status-card--normal ${mentalStatus === '普通' ? 'status-card--active' : ''}`}
                onClick={() => runDiagnosis('普通')}
              >
                <span className="status-card__emoji">😐</span>
                <span className="status-card__title">ちょっと疲れた</span>
                <span className="status-card__desc">普通の状態。無難にこなしたい。</span>
              </button>

              <button 
                className={`status-card status-card--tired ${mentalStatus === 'しんどい' ? 'status-card--active' : ''}`}
                onClick={() => runDiagnosis('しんどい')}
              >
                <span className="status-card__emoji">😫</span>
                <span className="status-card__title">限界・ない</span>
                <span className="status-card__desc">頭も体も限界。何もしたくない状態。</span>
              </button>
            </div>
          </div>

          {/* Section 2: Syllabus Assignment List */}
          <div className="rescue-card mt-4">
            <div className="rescue-card__header-row">
              <span className="text-label-lg font-bold text-primary">
                2. 控えているシラバス課題リスト (優先度自動シフト)
              </span>
              <button 
                className="add-task-toggle-btn"
                onClick={() => setIsFormOpen(!isFormOpen)}
              >
                <span className="material-symbols-outlined">{isFormOpen ? 'close' : 'add'}</span>
                <span>{isFormOpen ? '閉じる' : '課題を追加'}</span>
              </button>
            </div>
            <p className="text-label-sm text-on-surface-variant mb-3">
              大学のシラバスから逆算された重要タスクです。心の余裕に合わせて見え方が切り替わります。
            </p>

            {/* Task Add Form */}
            {isFormOpen && (
              <form onSubmit={handleAddTask} className="syllabus-form animate-slide-up">
                <div className="form-group-row">
                  <div className="form-group">
                    <label className="text-label-sm">講義名</label>
                    <input 
                      type="text" 
                      placeholder="例: 情報処理実習" 
                      value={newCourse}
                      onChange={(e) => setNewCourse(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="text-label-sm">残り日数 (日)</label>
                    <input 
                      type="number" 
                      min="0"
                      max="30"
                      value={newDays}
                      onChange={(e) => setNewDays(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group mt-2">
                  <label className="text-label-sm">課題・タスク内容</label>
                  <input 
                    type="text" 
                    placeholder="例: プログラミング課題提出" 
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mt-2">
                  <label className="text-label-sm">単位危険度（落単時の影響）</label>
                  <input 
                    type="text" 
                    placeholder="例: 出さないと評価がCからFに落ちる" 
                    value={newDanger}
                    onChange={(e) => setNewDanger(e.target.value)}
                  />
                </div>

                <div className="form-checkbox mt-2">
                  <input 
                    type="checkbox" 
                    id="is-critical-check"
                    checked={newIsCritical}
                    onChange={(e) => setNewIsCritical(e.target.checked)}
                  />
                  <label htmlFor="is-critical-check" className="text-label-sm">
                    ⚠️ この課題を出さないと即落単 (不合格) に直結する
                  </label>
                </div>

                <button type="submit" className="syllabus-form__submit-btn mt-3">
                  <span className="material-symbols-outlined">save</span>
                  <span>課題リストに保存</span>
                </button>
              </form>
            )}

            {/* List rendered with visual priorities switching animation classes */}
            <div className={`syllabus-list syllabus-list--active-${mentalStatus || 'none'}`}>
              {syllabusTasks.length === 0 ? (
                <p className="syllabus-list__empty text-body-md text-on-surface-variant">
                  登録されているシラバス課題はありません。
                </p>
              ) : (
                syllabusTasks.map((task) => {
                  // Compute dynamic animation priorities
                  let priorityClass = '';
                  
                  if (mentalStatus === 'しんどい') {
                    // Check if it is the recommended critical rescue task
                    const isCriticalRescue = task.daysRemaining <= 2 && task.isCritical;
                    if (isCriticalRescue) {
                      priorityClass = 'syllabus-item--glowing-rescue';
                    } else {
                      priorityClass = 'syllabus-item--dormant-tired';
                    }
                  } else if (mentalStatus === '普通') {
                    // Find the single recommended normal task
                    const isRecommendedNormal = diagnosis && diagnosis.today_task.has_task && 
                      diagnosis.today_task.title.includes(task.courseName) && 
                      diagnosis.today_task.title.includes(task.taskName);
                    
                    if (isRecommendedNormal) {
                      priorityClass = 'syllabus-item--focused';
                    } else {
                      priorityClass = 'syllabus-item--faded';
                    }
                  } else if (mentalStatus === '良い') {
                    // All active
                    priorityClass = 'syllabus-item--active-good';
                  }

                  return (
                    <div 
                      key={task.id} 
                      className={`syllabus-item ${task.isCritical ? 'syllabus-item--critical' : ''} ${priorityClass}`}
                    >
                      <div className="syllabus-item__main">
                        <div className="syllabus-item__badge-row">
                          <span className="syllabus-item__badge-course">{task.courseName}</span>
                          <span className={`syllabus-item__badge-days ${task.daysRemaining <= 2 ? 'urgent' : ''}`}>
                            締切まであと {task.daysRemaining} 日
                          </span>
                          {task.isCritical && (
                            <span className="syllabus-item__badge-danger">
                              落単危険度: 極高
                            </span>
                          )}
                        </div>
                        <h4 className="syllabus-item__name text-body-lg font-bold mt-1">
                          {task.taskName}
                        </h4>
                        <p className="syllabus-item__desc text-label-sm text-on-surface-variant mt-1">
                          📢 {task.dangerLevel}
                        </p>
                      </div>
                      <button 
                        className="syllabus-item__delete-btn"
                        onClick={() => handleDeleteTask(task.id)}
                        aria-label="課題を削除"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Diagnosis Outputs */}
        <div className="rescue-outputs">
          {diagnosis ? (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', height: '100%' }}>
              {/* Output Result Box */}
              <div className={`diagnosis-result-card ${!diagnosis.today_task.has_task ? 'diagnosis-result-card--rest animate-pulse-glow-green' : 'animate-pulse-glow-primary'}`}>
                <div className="diagnosis-result-card__header">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: '28px' }}>
                    {diagnosis.today_task.has_task ? 'auto_awesome' : 'spa'}
                  </span>
                  <span className="text-label-lg font-bold text-primary">
                    AIが算出した「今日すること」
                  </span>
                </div>

                <div className="diagnosis-result-card__body mt-3">
                  {diagnosis.today_task.has_task ? (
                    <div>
                      <div className="recommended-task-box">
                        <span className="text-label-sm text-on-surface-variant font-bold">🎯 今日の必達1件</span>
                        <h3 className="text-headline-md font-bold text-primary mt-1" style={{ textShadow: '0 0 12px rgba(255, 215, 169, 0.4)' }}>
                          {diagnosis.today_task.title}
                        </h3>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-label-sm text-on-surface-variant font-bold">💡 絞り込みの判定理由</span>
                        <p className="text-body-md text-on-surface mt-1" style={{ lineHeight: '1.5' }}>
                          {diagnosis.today_task.reason}
                        </p>
                      </div>

                      {/* Apply to daily schedule button */}
                      <button 
                        className="apply-schedule-btn mt-4"
                        onClick={handleApplyToSchedule}
                      >
                        <span className="material-symbols-outlined">add_to_photos</span>
                        <span>AIの決定を本日のスケジュールに適用</span>
                      </button>
                    </div>
                  ) : (
                    <div className="rest-state-box text-center py-4">
                      <span className="rest-emoji">🛀</span>
                      <h3 className="text-headline-lg font-bold text-green-400 mt-2">今日は完全休養日でOK！</h3>
                      <p className="text-body-md text-on-surface-variant mt-2" style={{ maxWidth: '400px', margin: '8px auto 0' }}>
                        落単直結の超緊急タスクはありません。心のエネルギーを充電することこそが、中長期的な落単回避の最短ルートです。
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Empathetic UX Message card */}
              <div className="empathy-card animate-slide-up">
                <div className="empathy-card__header">
                  <span className="material-symbols-outlined text-secondary" style={{ fontSize: '24px' }}>sentiment_satisfied</span>
                  <span className="text-label-lg font-bold text-secondary">
                    現役先輩AIからの寄り添いアドバイス
                  </span>
                </div>
                <div className="empathy-card__body mt-2">
                  <p className="text-body-md text-on-surface italic" style={{ lineHeight: '1.6', fontSize: '15px' }}>
                    "{diagnosis.ux_message}"
                  </p>
                </div>
              </div>

              {/* Exact JSON Output Panel requested by prompt */}
              <div className="json-output-card">
                <div className="json-output-card__header">
                  <span className="text-label-sm font-bold text-on-surface-variant">💻 AI GENERATED JSON RESPONSE (OUTPUT SCHEMA)</span>
                </div>
                <pre className="json-output-card__code">
                  <code>{JSON.stringify(diagnosis, null, 2)}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="empty-outputs-box text-center">
              <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: '64px', opacity: 0.3 }}>
                psychology
              </span>
              <h3 className="text-headline-md font-bold text-on-surface-variant mt-2">
                診断結果はここに表示されます
              </h3>
              <p className="text-body-md text-on-surface-variant mt-2" style={{ maxWidth: '320px', margin: '4px auto 0' }}>
                左側のパネルから、今日の「心の余裕」を選択すると、瞬時にシラバス危険度を掛け合わせた診断が実行されます。
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentalGpaRescue;
