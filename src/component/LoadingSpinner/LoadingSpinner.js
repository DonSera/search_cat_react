import style from "./LoadingSpinner.module.css";

console.log(style.loadingSpinner);

function LoadingSpinner() {
    const size = 120;
    const vieBox = `0 0 ${size} ${size}`;
    const center = size / 2;
    const thickness = 5;
    const backColor = "black";
    const color = "red";
    const fillColor = "transparent";

    const startPoint = `${thickness} ${center}`;
    const endPoint = `${size - thickness} ${center}`;

    const bezierPointy = size * 1.11
    const bezierPointx = thickness *1.7

    const draw = `M ${startPoint}
                  C ${bezierPointx} ${bezierPointy}, 
                  ${size - bezierPointx} ${bezierPointy}, 
                  ${endPoint}`;
    return (
        <div className={style["loading-spinner"]}>
            <svg width={size} height={size} viewBox={vieBox}
                 xmlns="http://www.w3.org/2000/svg">
                <circle cx={center} cy={center} r={center - thickness}
                        stroke={backColor} fill={fillColor} strokeWidth={thickness}>
                </circle>

                <path strokeLinecap={"round"} strokeWidth={thickness} stroke={color}
                      fill={fillColor} d={draw}>
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        from="0 60 60"
                        to="360 60 60"
                        dur="1s"
                        repeatCount="indefinite"
                    />
                </path>

                <text x={center/2} y={center*1.1} fontSize={size*0.15} fill={backColor}>Loading</text>
            </svg>
        </div>
    );
}

export default LoadingSpinner;