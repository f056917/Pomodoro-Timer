/**
 * Pomodoro Timer — 番茄钟
 * 纯前端实现，无框架依赖
 */

class PomodoroTimer {
  constructor() {
    // 时长配置（秒）
    this.workDuration = 25 * 60;
    this.breakDuration = 5 * 60;

    // 状态
    this.remaining = this.workDuration;
    this.isWorkSession = true;
    this.isRunning = false;
    this.rounds = 0;
    this.totalFocusSeconds = 0;
    this.intervalId = null;

    // 音频上下文（延迟初始化）
    this.audioCtx = null;

    // DOM 引用
    this.timeDisplay = document.getElementById('timeDisplay');
    this.sessionLabel = document.getElementById('sessionLabel');
    this.progressCircle = document.getElementById('progressCircle');
    this.roundCount = document.getElementById('roundCount');
    this.totalFocus = document.getElementById('totalFocus');

    this.btnStart = document.getElementById('btnStart');
    this.btnPause = document.getElementById('btnPause');
    this.btnReset = document.getElementById('btnReset');

    // 圆周长度
    this.circumference = 2 * Math.PI * 90;

    this.init();
  }

  init() {
    this.progressCircle.style.strokeDasharray = this.circumference;
    this.progressCircle.style.strokeDashoffset = '0';

    this.btnStart.addEventListener('click', () => this.start());
    this.btnPause.addEventListener('click', () => this.pause());
    this.btnReset.addEventListener('click', () => this.reset());
    this.timeDisplay.addEventListener('dblclick', () => this.toggleSession());

    this.updateDisplay();
  }

  start() {
    if (this.isRunning) return;

    // 请求通知权限
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    this.isRunning = true;
    this.btnStart.disabled = true;
    this.btnPause.disabled = false;

    const totalDuration = this.isWorkSession
      ? this.workDuration
      : this.breakDuration;

    // 记录本次开始的剩余秒数（用于进度计算）
    const startRemaining = this.remaining;

    this.intervalId = setInterval(() => {
      this.remaining--;

      if (this.remaining <= 0) {
        this.complete();

        // 重新计算进度基准（因为切换了 session）
        const newTotal = this.isWorkSession
          ? this.workDuration
          : this.breakDuration;
        this.updateDisplay(newTotal);
        return;
      }

      this.updateDisplay(totalDuration);
    }, 1000);
  }

  pause() {
    if (!this.isRunning) return;

    this.isRunning = false;
    clearInterval(this.intervalId);
    this.intervalId = null;

    this.btnStart.disabled = false;
    this.btnPause.disabled = true;
  }

  reset() {
    this.pause();
    this.isWorkSession = true;
    this.remaining = this.workDuration;
    this.updateDisplay(this.workDuration);

    this.progressCircle.classList.remove('break');
  }

  complete() {
    clearInterval(this.intervalId);
    this.intervalId = null;

    this.beep();

    if (this.isWorkSession) {
      // 完成一轮专注
      this.rounds++;
      this.totalFocusSeconds += this.workDuration;
      this.roundCount.textContent = this.rounds;
      this.totalFocus.textContent = this.formatMinutes(this.totalFocusSeconds);

      this.notify('🍅 专注时间结束！', '休息一下吧，站起来活动活动。');
    } else {
      this.notify('☕ 休息时间结束！', '准备好开始下一轮专注了吗？');
    }

    // 切换模式
    this.isWorkSession = !this.isWorkSession;
    this.remaining = this.isWorkSession
      ? this.workDuration
      : this.breakDuration;

    this.sessionLabel.textContent = this.isWorkSession ? '专注' : '休息';

    if (this.isWorkSession) {
      this.progressCircle.classList.remove('break');
    } else {
      this.progressCircle.classList.add('break');
    }

    // 自动开始下一轮
    this.isRunning = false;
    this.btnStart.disabled = false;
    this.btnPause.disabled = true;

    const newTotal = this.isWorkSession
      ? this.workDuration
      : this.breakDuration;
    this.updateDisplay(newTotal);
  }

  updateDisplay(totalSecondsOverride) {
    const totalDuration = totalSecondsOverride || (
      this.isWorkSession ? this.workDuration : this.breakDuration
    );

    // 时间文本
    const mins = Math.floor(this.remaining / 60);
    const secs = this.remaining % 60;
    this.timeDisplay.textContent =
      `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // 进度环
    const progress = this.remaining / totalDuration;
    const offset = this.circumference * (1 - progress);
    this.progressCircle.style.strokeDashoffset = offset;

    // 标签
    this.sessionLabel.textContent = this.isWorkSession ? '专注' : '休息';
  }

  toggleSession() {
    if (this.isRunning) return;

    this.isWorkSession = !this.isWorkSession;
    this.remaining = this.isWorkSession
      ? this.workDuration
      : this.breakDuration;

    if (this.isWorkSession) {
      this.progressCircle.classList.remove('break');
    } else {
      this.progressCircle.classList.add('break');
    }

    const total = this.isWorkSession ? this.workDuration : this.breakDuration;
    this.updateDisplay(total);
  }

  beep() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.4);

      osc.start(this.audioCtx.currentTime);
      osc.stop(this.audioCtx.currentTime + 0.4);
    } catch {
      // 静默处理音频播放失败
    }
  }

  notify(title, body) {
    if (Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '🍅' });
      } catch {
        // 静默处理
      }
    }
  }

  formatMinutes(seconds) {
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h${m}m` : `${h}h`;
  }
}

// 启动
document.addEventListener('DOMContentLoaded', () => {
  new PomodoroTimer();
});
