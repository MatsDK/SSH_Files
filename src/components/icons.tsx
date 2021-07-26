interface Props {
  color?: string;
}
export const ShellIcon: React.FC<Props> = ({ color = "#b3b3b3" }) => {
  return (
    <svg
      width="19"
      height="13"
      viewBox="0 0 19 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="19" height="13" rx="3" fill={color} />
      <rect
        width="0.779272"
        height="4.01366"
        transform="matrix(0.699867 -0.714273 0.699867 0.714273 2 1.55661)"
        fill="#0B0E11"
      />
      <rect
        width="0.80597"
        height="3.89151"
        transform="matrix(-0.699867 -0.714273 0.699867 -0.714273 2.63087 6.64644)"
        fill="#0B0E11"
      />
      <rect x="6" y="6" width="4" height="1" fill="#0B0E11" />
    </svg>
  );
};

export const ClosePopupIcon = () => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 -0.707108 0.707106 0.707108 0 18.5822)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 -0.707108 0.707106 0.707108 0 18.5822)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 -0.707108 0.707106 0.707108 0 18.5822)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 0.707108 -0.707106 0.707108 2.41772 7.62939e-06)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 0.707108 -0.707106 0.707108 2.41772 7.62939e-06)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 0.707108 -0.707106 0.707108 2.41772 7.62939e-06)"
      />
    </svg>
  );
};

export const EditIcon = () => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="20" width="5.98603" height="6" />
      <rect
        width="8.47541"
        height="24.0481"
        transform="matrix(0.706282 0.70793 -0.706282 0.70793 16.9847 2.97562)"
      />
      <rect
        width="8.47541"
        height="2.91084"
        transform="matrix(0.706282 0.70793 -0.706282 0.70793 20.0139 0)"
      />
    </svg>
  );
};

export const DevicesIcon: React.FC<Props> = ({ color = "#c4c4c4" }) => {
  return (
    <svg
      width="43"
      height="29"
      viewBox="0 0 43 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="16" width="42" height="13" rx="4" fill={color} />
      <circle cx="33.5" cy="22.5" r="2.5" fill="black" />
      <rect x="6" y="19" width="2" height="7" rx="1" fill="black" />
      <rect x="18" y="19" width="2" height="7" rx="1" fill="black" />
      <rect x="24" y="19" width="2" height="7" rx="1" fill="black" />
      <rect x="12" y="19" width="2" height="7" rx="1" fill="black" />
      <rect x="1" width="42" height="13" rx="4" fill={color} />
      <circle cx="34.5" cy="6.5" r="2.5" fill="black" />
      <rect x="7" y="3" width="2" height="7" fill="black" />
      <rect x="19" y="3" width="2" height="7" fill="black" />
      <rect x="25" y="3" width="2" height="7" fill="black" />
      <rect x="13" y="3" width="2" height="7" fill="black" />
    </svg>
  );
};
