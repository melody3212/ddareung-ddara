// src/pages/MyPageHeader.jsx
import React from "react";
import { PencilSimple } from "phosphor-react";
import Button from "../components/Button";
import "../assets/MyPageHeader.css";

/**
 * MyPageHeader
 * 상단 프로필 영역 (아바타 + 이름·이메일 + 수정 버튼 + 로그아웃)
 * Props:
 *  - user: { username, email, avatarUrl? }
 *  - onEdit: 수정 버튼 클릭 핸들러
 *  - logout: 로그아웃 버튼 클릭 핸들러
 */
export default function MyPageHeader({ user, onEdit, logout }) {
  return (
    <div className="MyPageHeader">
      {/* 좌측: 프로필 아바타 */}
      <div className="MyPageHeader__avatar">
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="프로필" />
        ) : (
          <div className="MyPageHeader__avatar--placeholder" />
        )}
      </div>

      {/* 중앙: 이름 · 이메일 */}
      <div className="MyPageHeader__info">
        <h2 className="MyPageHeader__name">{user.username} 님</h2>
        <p className="MyPageHeader__email">{user.email}</p>
      </div>

      {/* 우측: 수정 버튼 (아이콘 전용) */}
      <Button
        iconOnly
        size="sm"
        className="MyPageHeader__editBtn"
        onClick={onEdit}
        aria-label="프로필 수정"
      >
        <PencilSimple size={20} weight="bold" />
      </Button>

      {/* 로그아웃 버튼 - 나중에 edit 페이지로 뺄듯 */}
      <Button
        size="md"
        className="MyPageHeader__logoutBtn"
        onClick={logout}
      >
        로그아웃
      </Button>
    </div>
  );
}
