
import "../assets/Button.css";

// ✅ 범용 커스텀 버튼 컴포넌트
const Button = ({
  onClick,           // 버튼 클릭 시 실행할 함수
  children,          // 버튼 안에 들어갈 요소 (텍스트, 아이콘 등)
  className = "",    // 추가적인 사용자 정의 클래스
  iconOnly = false,  // 아이콘만 들어가는 버튼인지 여부
  circle = false,    // 버튼을 원형으로 만들지 여부
  size = "md",       // 버튼 크기: "sm", "md", "lg"
  ...rest            // 나머지 props (예: type, disabled 등)
}) => {

  // ✅ 클래스들을 조건에 따라 배열로 구성
  const classNames = [
    "Button",                 // 기본 클래스
    `Button--${size}`,        // 사이즈 클래스 (예: Button--md)
    iconOnly && "Button--iconOnly", // 아이콘 전용이면 추가
    circle && "Button--circle",     // 원형이면 추가
    className                // 외부에서 받은 클래스
  ]
    .filter(Boolean)         // falsy한 값 제거 (예: false, undefined 등)
    .join(" ");              // 공백으로 연결

  return (
    <button
      className={classNames}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;

