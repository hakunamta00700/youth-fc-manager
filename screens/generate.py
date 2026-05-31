#!/usr/bin/env python3
"""Youth FC Manager - 61개 화면 HTML 시안 일괄 생성 (v2 - direct script)"""
import os
BASE = os.path.dirname(os.path.abspath(__file__))

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

SAVED = []

# --- Base Templates ---
BASE_T = '''
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__ | Youth FC Manager</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="__CSS__">
</head>
<body>
  __SIDEBAR__
  <div class="main-content">
    <div class="topbar">
      <div class="d-flex align-items-center gap-3">
        <button class="btn btn-sm d-md-none" id="sidebarToggle"><i class="bi bi-list fs-5"></i></button>
        <h1 class="page-title mb-0">__TITLE__</h1>
      </div>
      <div class="user-badge">
        <span class="d-none d-sm-inline text-muted small">__ROLE_BADGE__</span>
        <div class="avatar">__ROLE_ICON__</div>
      </div>
    </div>
    <div class="content-area">
      __BODY__
    </div>
  </div>
  __MOBILE_NAV__
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="__JS__"></script>
</body>
</html>
'''

FULLSCREEN_T = '''
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>__TITLE__ | Youth FC Manager</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="__CSS__">
</head>
<body>
  __BODY__
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="__JS__"></script>
</body>
</html>
'''

def render_base(title, body, sidebar, role_badge, role_icon, css_path, js_path, mobile_nav):
    html = BASE_T.replace('__TITLE__', title)
    html = html.replace('__BODY__', body)
    html = html.replace('__SIDEBAR__', sidebar)
    html = html.replace('__ROLE_BADGE__', role_badge)
    html = html.replace('__ROLE_ICON__', role_icon)
    html = html.replace('__CSS__', css_path)
    html = html.replace('__JS__', js_path)
    html = html.replace('__MOBILE_NAV__', mobile_nav)
    return html

def render_full(title, body, css_path, js_path):
    html = FULLSCREEN_T.replace('__TITLE__', title)
    html = html.replace('__BODY__', body)
    html = html.replace('__CSS__', css_path)
    html = html.replace('__JS__', js_path)
    return html

def mn(role, active_rel=None):
    # active_rel is relative path to highlight
    all_items = {
        'admin': [('house','대시보드','../admin/dashboard.html'), ('people','원생','../admin/student-list.html'), ('wallet2','회비','../admin/fee-status.html'), ('bell','공지','../admin/notice-list.html'), ('gear','설정','../admin/settings.html')],
        'manager': [('house','대시보드','../manager/dashboard.html'), ('credit-card','회비','../manager/fee-input.html'), ('people','원생','../manager/student-list.html'), ('calculator','정산','../manager/payment-summary.html'), ('gear','설정','../admin/settings.html')],
        'coach': [('house','대시보드','../coach/dashboard.html'), ('check-circle','출석','../coach/attendance-check.html'), ('journal-text','훈련','../coach/training-record.html'), ('people','원생','../coach/student-list.html'), ('calendar3','일정','../coach/schedule.html')],
        'parent': [('house','대시보드','../parent/dashboard.html'), ('person-circle','자녀','../parent/child-info.html'), ('calendar-check','출석','../parent/attendance-history.html'), ('wallet2','회비','../parent/fee-payment.html'), ('megaphone','공지','../parent/notice.html')],
    }
    items = all_items.get(role, [])
    parts = ['<div class="mobile-bottom-nav">']
    for icon, label, url in items:
        active_class = ' active' if active_rel and active_rel in url else ''
        parts.append(f'<a href="{url}" class="{active_class}"><i class="bi bi-{icon}"></i><span>{label}</span></a>')
    parts.append('</div>')
    return '\n'.join(parts)

def stat_card(icon, icon_bg, value, label, color='var(--primary)'):
    return f'<div class="stat-card card" style="border-left:4px solid {color}">' \
           f'<div class="d-flex align-items-center gap-3">' \
           f'<div class="stat-icon" style="background:{icon_bg}20;color:{icon_bg}"><i class="bi bi-{icon}"></i></div>' \
           f'<div><div class="stat-value">{value}</div><div class="stat-label">{label}</div></div></div></div>'

# --- Sidebars ---
ADMIN_SB = '''<nav class="sidebar">
  <div class="logo"><i class="bi bi-trophy"></i> Youth FC</div>
  <div class="nav-section">대시보드</div>
  <a href="../admin/dashboard.html" class="nav-item"><i class="bi bi-house"></i> 운영 대시보드</a>
  <div class="nav-section">원생 관리</div>
  <a href="../admin/student-list.html" class="nav-item"><i class="bi bi-people"></i> 원생 목록</a>
  <a href="../admin/student-detail.html" class="nav-item"><i class="bi bi-person-badge"></i> 원생 상세</a>
  <a href="../admin/student-register.html" class="nav-item"><i class="bi bi-person-plus"></i> 원생 등록</a>
  <a href="../admin/class-assignment.html" class="nav-item"><i class="bi bi-diagram-3"></i> 반 배정 관리</a>
  <a href="../admin/student-status.html" class="nav-item"><i class="bi bi-arrow-left-right"></i> 상태 관리</a>
  <div class="nav-section">회비</div>
  <a href="../admin/fee-status.html" class="nav-item"><i class="bi bi-wallet2"></i> 회비 현황</a>
  <div class="nav-section">소통/공지</div>
  <a href="../admin/notice-write.html" class="nav-item"><i class="bi bi-pencil-square"></i> 공지사항 작성</a>
  <a href="../admin/notice-list.html" class="nav-item"><i class="bi bi-megaphone"></i> 공지사항 목록</a>
  <div class="nav-section">리포트</div>
  <a href="../admin/report-generate.html" class="nav-item"><i class="bi bi-file-earmark-text"></i> 리포트 생성/발송</a>
  <div class="nav-section">체험/모집</div>
  <a href="../admin/trial-list.html" class="nav-item"><i class="bi bi-hand-index"></i> 체험신청 목록</a>
  <div class="nav-section">코치 관리</div>
  <a href="../admin/coach-list.html" class="nav-item"><i class="bi bi-person-badge"></i> 코치 목록</a>
  <a href="../admin/coach-register.html" class="nav-item"><i class="bi bi-person-plus"></i> 코치 등록</a>
  <div class="nav-section">돌발 상황</div>
  <a href="../admin/weather-cancel.html" class="nav-item"><i class="bi bi-cloud-rain"></i> 우천/취소 공지</a>
  <div class="nav-section">시스템</div>
  <a href="../admin/settings.html" class="nav-item"><i class="bi bi-gear"></i> 권한/설정</a>
  <a href="../admin/attendance-stats.html" class="nav-item"><i class="bi bi-graph-up"></i> 출석 통계</a>
  <div style="margin-top:auto;padding:1rem;border-top:1px solid rgba(255,255,255,0.08);">
    <a href="../index.html" class="nav-item"><i class="bi bi-grid"></i> 전체 화면 목록</a>
  </div>
</nav>'''

MANAGER_SB = '''<nav class="sidebar">
  <div class="logo"><i class="bi bi-trophy"></i> Youth FC</div>
  <div class="nav-section">대시보드</div>
  <a href="../manager/dashboard.html" class="nav-item"><i class="bi bi-house"></i> 대시보드</a>
  <div class="nav-section">회비</div>
  <a href="../manager/fee-input.html" class="nav-item"><i class="bi bi-credit-card"></i> 회비 입력</a>
  <a href="../manager/fee-list.html" class="nav-item"><i class="bi bi-list-ul"></i> 납부 목록</a>
  <a href="../manager/payment-summary.html" class="nav-item"><i class="bi bi-calculator"></i> 정산 요약</a>
  <a href="../manager/expense-input.html" class="nav-item"><i class="bi bi-cash-stack"></i> 지출 입력</a>
  <div class="nav-section">원생</div>
  <a href="../manager/student-list.html" class="nav-item"><i class="bi bi-people"></i> 원생 목록</a>
  <a href="../manager/student-detail.html" class="nav-item"><i class="bi bi-person-badge"></i> 원생 상세</a>
  <div class="nav-section">리포트</div>
  <a href="../manager/report-view.html" class="nav-item"><i class="bi bi-file-text"></i> 리포트 조회</a>
  <div class="nav-section">부가</div>
  <a href="../manager/schedule.html" class="nav-item"><i class="bi bi-calendar3"></i> 일정 관리</a>
  <a href="../manager/board.html" class="nav-item"><i class="bi bi-chat-square-text"></i> 게시판</a>
  <div style="margin-top:auto;padding:1rem;border-top:1px solid rgba(255,255,255,0.08);">
    <a href="../index.html" class="nav-item"><i class="bi bi-grid"></i> 전체 화면 목록</a>
  </div>
</nav>'''

COACH_SB = '''<nav class="sidebar">
  <div class="logo"><i class="bi bi-trophy"></i> Youth FC</div>
  <div class="nav-section">대시보드</div>
  <a href="../coach/dashboard.html" class="nav-item"><i class="bi bi-house"></i> 대시보드</a>
  <div class="nav-section">출석</div>
  <a href="../coach/attendance-check.html" class="nav-item"><i class="bi bi-check-circle"></i> 출석 체크</a>
  <a href="../coach/attendance-stats.html" class="nav-item"><i class="bi bi-bar-chart"></i> 출석 통계</a>
  <a href="../coach/attendance-note.html" class="nav-item"><i class="bi bi-journal-plus"></i> 출석 메모</a>
  <div class="nav-section">훈련</div>
  <a href="../coach/training-record.html" class="nav-item"><i class="bi bi-journal-text"></i> 훈련 기록</a>
  <a href="../coach/training-history.html" class="nav-item"><i class="bi bi-clock-history"></i> 기록 조회</a>
  <a href="../coach/training-evaluation.html" class="nav-item"><i class="bi bi-star"></i> 훈련 평가</a>
  <div class="nav-section">원생</div>
  <a href="../coach/student-list.html" class="nav-item"><i class="bi bi-people"></i> 원생 목록</a>
  <a href="../coach/student-detail.html" class="nav-item"><i class="bi bi-person-badge"></i> 원생 상세</a>
  <a href="../coach/student-physical.html" class="nav-item"><i class="bi bi-activity"></i> 체력 측정</a>
  <div class="nav-section">소통/부가</div>
  <a href="../coach/coach-comment.html" class="nav-item"><i class="bi bi-chat-dots"></i> 코치 코멘트</a>
  <a href="../coach/board.html" class="nav-item"><i class="bi bi-chat-square-text"></i> 게시판</a>
  <a href="../coach/schedule.html" class="nav-item"><i class="bi bi-calendar3"></i> 내 일정</a>
  <a href="../coach/office-supplies.html" class="nav-item"><i class="bi bi-box"></i> 비품 요청</a>
  <div style="margin-top:auto;padding:1rem;border-top:1px solid rgba(255,255,255,0.08);">
    <a href="../index.html" class="nav-item"><i class="bi bi-grid"></i> 전체 화면 목록</a>
  </div>
</nav>'''

PARENT_SB = '''<nav class="sidebar">
  <div class="logo"><i class="bi bi-trophy"></i> Youth FC</div>
  <div class="nav-section">대시보드</div>
  <a href="../parent/dashboard.html" class="nav-item"><i class="bi bi-house"></i> 대시보드</a>
  <div class="nav-section">자녀</div>
  <a href="../parent/child-info.html" class="nav-item"><i class="bi bi-person-circle"></i> 내 자녀 정보</a>
  <a href="../parent/attendance-history.html" class="nav-item"><i class="bi bi-calendar-check"></i> 출석 이력</a>
  <a href="../parent/training-history.html" class="nav-item"><i class="bi bi-journal-text"></i> 수업 기록</a>
  <div class="nav-section">회비</div>
  <a href="../parent/fee-payment.html" class="nav-item"><i class="bi bi-wallet2"></i> 회비 납부</a>
  <a href="../parent/receipt.html" class="nav-item"><i class="bi bi-receipt"></i> 영수증</a>
  <div class="nav-section">리포트</div>
  <a href="../parent/evaluation-report.html" class="nav-item"><i class="bi bi-file-text"></i> 평가 리포트</a>
  <div class="nav-section">소통</div>
  <a href="../parent/notice.html" class="nav-item"><i class="bi bi-megaphone"></i> 공지사항</a>
  <a href="../parent/message.html" class="nav-item"><i class="bi bi-chat-dots"></i> 메시지</a>
  <div class="nav-section">부가</div>
  <a href="../parent/schedule.html" class="nav-item"><i class="bi bi-calendar3"></i> 일정</a>
  <a href="../parent/photo-gallery.html" class="nav-item"><i class="bi bi-images"></i> 사진 갤러리</a>
  <a href="../parent/contact.html" class="nav-item"><i class="bi bi-telephone"></i> 연락처</a>
  <a href="../parent/medical-info.html" class="nav-item"><i class="bi bi-heart-pulse"></i> 건강 정보</a>
  <a href="../parent/settings.html" class="nav-item"><i class="bi bi-gear"></i> 설정</a>
  <div style="margin-top:auto;padding:1rem;border-top:1px solid rgba(255,255,255,0.08);">
    <a href="../index.html" class="nav-item"><i class="bi bi-grid"></i> 전체 화면 목록</a>
  </div>
</nav>'''

CSS_PATH = '../assets/css/style.css'
JS_PATH = '../assets/js/main.js'
