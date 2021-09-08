import "./App.css";
import CatCard from "./component/CatCard";
import LoadingSpinner from "./component/LoadingSpinner";
import {useEffect, useRef, useState} from "react";

function App() {
    const timer = useRef(null); // debounce를 위한 값
    const [loading, setLoading] = useState(false);    // True가 로딩이 나오게
    const [inputValue, setInputValue] = useState(""); // 입력값
    const [imgInfo, setImgInfo] = useState([]);       // 이미지 데이터

    // 에러로 취급되는 가짓수 1.입력이 없을 때 2.결과 undefined 3.결과가 비었을 때  4.그 외 에러
    const [errorText, setErrorText] = useState("");


    useEffect(() => {
        if (inputValue === "") {
            setErrorText(`입력해 주세요.`); // 에러 1번
        } else {
            console.log(`입력 문자 :  ${inputValue}`);
            setLoading(true); // 로딩 시작
            getMessage()
                .then(message => {
                    setErrorText(message); // 에러 2,3번 + 정상작동일 경우 ""가 들어김
                    setLoading(false); // 로딩 끝
                })
                .catch(e => {
                    setErrorText(`에러 ${e}`); // 에러 4번
                    setLoading(false);
                });
        }
    }, [inputValue])

    function debounce(ele) {
        // 단어 단위로 검색정갱신
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            setInputValue(ele.target.value);
        }, 500);
    }

    async function getMessage() {
        let errorMessage = "";
        const imgInfoArray = await getJson(inputValue)
        if (imgInfoArray === undefined) {
            errorMessage = `지우고 다시 입력해 주세요`;
        } else if (imgInfoArray.length === 0) {
            errorMessage = `결과가 없습니다.`;
        } else {
            saveImgInfo(imgInfoArray);
            errorMessage = "";
        }
        return errorMessage;
    }

    async function getJson(text) {
        // API를 이용하여 json 결과 array로 불러오기
        const url = `https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=${text}`;
        const imgInfoFetch = await fetch(url);
        const imgInfoJson = await imgInfoFetch.json();
        return imgInfoJson.data;
    }

    function saveImgInfo(imgInfoArray) {
        // array에 담긴 이미지 정보 저장하기
        const checkOverlapUrlSet = new Set(); // 중복 확인용
        const newImgInfoArray =  [];// 결과 넣을 공간
        imgInfoArray.map(obj => {
                // 이전에 존재하는 경우 넘어가기
                const imgUrl = obj.url;
                if (checkOverlapUrlSet.has(imgUrl)) return;

                const imgName = obj.name;
                const nameArray = imgName.split(' / ');
                checkOverlapUrlSet.add(imgUrl);
                newImgInfoArray.push({url: imgUrl, engName: nameArray[0], koName: nameArray[1]});
            }
        );
        // 결과 한번에 넣기
        setImgInfo(newImgInfoArray);
    }

    function renderDiv() {
        if (loading) return <LoadingSpinner/>;
        else if (errorText === "") return (
            imgInfo.map((obj, index) => {
                return <CatCard url={obj.url}
                                engName={obj.engName}
                                koName={obj.koName}
                                lazy={false} index={index}/>;
            })
        ); else return <div>{errorText}</div>;
    }

    return (
        <div className={`App`}>
            <header className={`App-header`}>
                <main>
                    <div>
                        <input className={`input`} type={`text`} id={`inputType`}
                               placeholder={`고양이 종류를 입력해주세요.`}
                               onChange={debounce}/>
                        {/*value={inputValue}/>*/}
                    </div>
                    <div className={`cat-div`} id={`catDiv`}>
                        {renderDiv()}
                    </div>
                </main>
            </header>
        </div>
    );
}

export default App;