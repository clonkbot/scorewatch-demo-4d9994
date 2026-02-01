import { useState, useEffect } from 'react';
import './styles.css';

type Sport = 'padel' | 'pickleball' | 'tennis';

interface ScoreState {
  player1: number;
  player2: number;
  sets1: number;
  sets2: number;
}

const sportConfig: Record<Sport, { maxScore: number; winBy: number; maxSets: number; icon: string }> = {
  padel: { maxScore: 6, winBy: 2, maxSets: 3, icon: '🎾' },
  pickleball: { maxScore: 11, winBy: 2, maxSets: 3, icon: '🏓' },
  tennis: { maxScore: 6, winBy: 2, maxSets: 3, icon: '🎾' },
};

const countryFlags: Record<string, string> = {
  US: '🇺🇸',
  DR: '🇩🇴',
  AT: '🇦🇹',
  ES: '🇪🇸',
  FR: '🇫🇷',
  GB: '🇬🇧',
  MX: '🇲🇽',
  BR: '🇧🇷',
};

function WatchFace({ sport, score, onIncrement }: { sport: Sport; score: ScoreState; onIncrement: (player: 1 | 2) => void }) {
  const config = sportConfig[sport];

  return (
    <div className="watch-container">
      <div className="watch-bezel">
        <div className="watch-screen">
          <div className="watch-content">
            <div className="score-display">
              <button
                className="score-box player1"
                onClick={() => onIncrement(1)}
              >
                <span className="score-number">{score.player1}</span>
              </button>
              <div className="score-divider">
                <span className="colon">:</span>
              </div>
              <button
                className="score-box player2"
                onClick={() => onIncrement(2)}
              >
                <span className="score-number">{score.player2}</span>
              </button>
            </div>
            <div className="sets-row">
              <div className="sets-indicator">
                <span className="sets-label">Sets</span>
                <span className="sets-value">{score.sets1} - {score.sets2}</span>
              </div>
            </div>
            <div className="sport-badge">
              <span>{config.icon}</span>
              <span className="sport-name">{sport}</span>
            </div>
          </div>
          <div className="watch-notch"></div>
        </div>
      </div>
      <div className="watch-crown"></div>
      <div className="watch-button"></div>
    </div>
  );
}

function AppIcon({ score1, score2, flag }: { score1: number; score2: number; flag: string }) {
  return (
    <div className="app-icon">
      <div className="app-icon-score">
        <span className="icon-score-num">{score1}</span>
        <span className="icon-colon">:</span>
        <span className="icon-score-num">{score2}</span>
      </div>
      <div className="app-icon-bottom">
        <div className="icon-plus">+</div>
        <div className="icon-flag">{flag}</div>
      </div>
    </div>
  );
}

interface SubscriptionCardProps {
  type: 'yearly' | 'weekly';
  price: string;
  timeAgo: string;
  badge: 'NEW SUB' | 'TRIAL';
  score1: number;
  score2: number;
  flag: string;
  delay: number;
}

function SubscriptionCard({ type, price, timeAgo, badge, score1, score2, flag, delay }: SubscriptionCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`subscription-card ${visible ? 'visible' : ''}`}>
      <AppIcon score1={score1} score2={score2} flag={flag} />
      <div className="subscription-info">
        <div className="subscription-type">{type === 'yearly' ? 'Yearly' : 'Weekly'}</div>
        <div className="subscription-meta">{timeAgo} · App Store</div>
      </div>
      <div className="subscription-price-section">
        <div className="subscription-price">
          {price} <span className="chevron">›</span>
        </div>
        <div className={`subscription-badge ${badge === 'NEW SUB' ? 'new-sub' : 'trial'}`}>
          {badge}
        </div>
      </div>
    </div>
  );
}

function NotificationPanel() {
  const [showTotal, setShowTotal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTotal(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <span className="notification-date">Today</span>
        <span className={`notification-total ${showTotal ? 'visible' : ''}`}>4,99 US$</span>
      </div>
      <div className="notification-cards">
        <SubscriptionCard
          type="yearly"
          price="4,99 US$"
          timeAgo="8 hr ago"
          badge="NEW SUB"
          score1={9}
          score2={7}
          flag={countryFlags.US}
          delay={500}
        />
        <SubscriptionCard
          type="weekly"
          price="Free"
          timeAgo="12 hr ago"
          badge="TRIAL"
          score1={40}
          score2={30}
          flag={countryFlags.DR}
          delay={800}
        />
        <SubscriptionCard
          type="weekly"
          price="Free"
          timeAgo="12 hr ago"
          badge="TRIAL"
          score1={30}
          score2={15}
          flag={countryFlags.AT}
          delay={1100}
        />
      </div>
    </div>
  );
}

export default function App() {
  const [sport, setSport] = useState<Sport>('padel');
  const [score, setScore] = useState<ScoreState>({ player1: 3, player2: 2, sets1: 1, sets2: 0 });
  const [activeTab, setActiveTab] = useState<'demo' | 'revenue'>('demo');

  const handleIncrement = (player: 1 | 2) => {
    setScore(prev => {
      const key = player === 1 ? 'player1' : 'player2';
      const newScore = { ...prev, [key]: prev[key] + 1 };

      // Simple score reset at max
      if (newScore[key] >= sportConfig[sport].maxScore) {
        const setsKey = player === 1 ? 'sets1' : 'sets2';
        return {
          ...newScore,
          player1: 0,
          player2: 0,
          [setsKey]: prev[setsKey] + 1
        };
      }
      return newScore;
    });
  };

  const resetGame = () => {
    setScore({ player1: 0, player2: 0, sets1: 0, sets2: 0 });
  };

  return (
    <div className="app">
      <div className="bg-gradient"></div>
      <div className="bg-noise"></div>

      <header className="header">
        <div className="logo">
          <span className="logo-icon">⌚</span>
          <span className="logo-text">ScoreWatch</span>
        </div>
        <div className="tagline">Keep score. Stay in the game.</div>
      </header>

      <nav className="tab-nav">
        <button
          className={`tab-button ${activeTab === 'demo' ? 'active' : ''}`}
          onClick={() => setActiveTab('demo')}
        >
          Watch Demo
        </button>
        <button
          className={`tab-button ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue Proof
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'demo' ? (
          <section className="demo-section">
            <div className="sport-selector">
              {(['padel', 'pickleball', 'tennis'] as Sport[]).map((s) => (
                <button
                  key={s}
                  className={`sport-button ${sport === s ? 'active' : ''}`}
                  onClick={() => { setSport(s); resetGame(); }}
                >
                  {sportConfig[s].icon} {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>

            <div className="watch-demo-area">
              <WatchFace sport={sport} score={score} onIncrement={handleIncrement} />

              <div className="demo-instructions">
                <h3>Try it out!</h3>
                <p>Tap the score boxes to increment</p>
                <button className="reset-button" onClick={resetGame}>
                  Reset Game
                </button>
              </div>
            </div>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h4>One-Tap Scoring</h4>
                <p>Update scores instantly with a single tap on your watch</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🌍</div>
                <h4>Multi-Sport</h4>
                <p>Padel, Pickleball, Tennis - all your racquet sports covered</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⌚</div>
                <h4>Watch Native</h4>
                <p>Designed specifically for Apple Watch - no phone needed</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="revenue-section">
            <div className="revenue-header">
              <h2>Real Revenue, Day One</h2>
              <p>Simple apps can generate real income</p>
            </div>
            <NotificationPanel />
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">$4.99</div>
                <div className="stat-label">Today's Revenue</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">2</div>
                <div className="stat-label">Free Trials</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">1</div>
                <div className="stat-label">Annual Sub</div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        Requested by <a href="https://twitter.com/0xPaulius" target="_blank" rel="noopener noreferrer">@0xPaulius</a> · Built by <a href="https://twitter.com/clonkbot" target="_blank" rel="noopener noreferrer">@clonkbot</a>
      </footer>
    </div>
  );
}
