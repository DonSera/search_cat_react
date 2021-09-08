import './App.css';
import CatCard from "./component/CatCard";
import LoadingSpinner from "./component/LoadingSpinner";
import {useEffect, useState} from "react";

function App() {
    let timer;
    let [loading, setLoading] = useState(false); // True가 로딩이 나오게
    let [inputValue, setInputValue] = useState("");
    let [catCard, setCatCard] = useState("");

    useEffect(() => {
        // 입력값이 바뀌면 setType 호출
        setType();
    }, [inputValue])

    function debounce(ele) {
        // 단어 단위로 검색정갱신
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            setInputValue(ele.target.value);
        }, 500);
    }

    async function setType() {
        // 로딩 시작
        setLoading(true);

        console.log("입력 문자 : " + inputValue);
        let checking = false; // 디버깅용

        // 내용 초기화
        let pushArray;

        try {
            if (inputValue === "") {
                // 아무것도 들어 오지 않은 경우
                pushArray = "입력해 주세요.";
            } else {
                const jsonArray = await getJson(inputValue)
                if (jsonArray.message) {
                    // 결과가 undefined인 경우
                    pushArray = jsonArray.message;
                } else if (jsonArray.length === 0) {
                    // 결과가 0개인 경우
                    pushArray = "결과가 없습니다."
                } else {
                    // 정상적인 결과
                    pushArray = addImges(jsonArray);
                    checking = true;
                }
            }
        } catch (e) {
            // 에러나는 경우
            pushArray = '에러' + e;
        }

        // 결과 한번에 넣기
        setCatCard(pushArray);
        if (checking) console.log("정상적으로 값을 받음"); // 디버깅 : 정상적 결과

        // 로딩 끝내기
        setLoading(false);
    }

    async function getJson(input) {
        console.log("fetch start");
        const url = "https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=" + input;

        // api 결과(json 형식)
        const result = await fetch(url)
            .then(res => res.json())
            .then((resJson) => {
                return resJson.data;
            })
        console.log("fetch end");

        if (result === undefined) {
            return {message: "다시 입력해 주세요"}
        }
        return result;
    }

    function addImges(jsonArray) {
        const imgUrlArray = []; // 중복 확인용
        const pushArray = []; // 결과 넣을 공간
        jsonArray.map((array) => {
                const imgUrl = array.url;
                const imgName = array.name;
                const nameArray = imgName.split(' / ');

                // 이전에 존재하는 경우 넘어가기
                if (imgUrlArray.includes(imgUrl)) return true;
                imgUrlArray.push(imgUrl);
                pushArray.push({url: imgUrl, engName: nameArray[0], koName: nameArray[1]});

            }
        );

        return pushArray;
    }

    return (
        <div className={"App"}>
            <header className={"App-header"}>
                <main>
                    <div>
                        <input className={"input"} type="text" id="inputType"
                               placeholder="고양이 종류를 입력해주세요."
                               onInput={debounce}/>
                        {/*value={inputValue}/>*/}
                    </div>
                    <div className={"cat-div"} id="catDiv">
                        {/*로딩 여부 ? 로딩 : 메세지 여부 ? 메세지 : 이미지*/}
                        {
                            loading ? <LoadingSpinner/>
                                : typeof catCard === "string" ? catCard
                                    : catCard.map((obj, index) => {
                                        return <CatCard url={obj.url}
                                                        engName={obj.engName}
                                                        koName={obj.koName}
                                                        lazy={false} index={index}/>;
                                    })
                        }
                    </div>
                </main>
            </header>
        </div>
    );
}

export default App;