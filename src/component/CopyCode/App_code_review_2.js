import '../../App.css';
import CatCard from "../CatCard";
import LoadingSpinner from "../LoadingSpinner";
import {useEffect, useRef, useState} from "react";

function App() {
    const timer = useRef();

    const [loading, setLoading] = useState(false); // True가 로딩이 나오게
    const [error, setError] = useState(false);

    const [inputValue, setInputValue] = useState("");
    const [catCard, setCatCard] = useState("");

    function debounce(ele) {
        // 단어 단위로 검색정갱신
        setInputValue(ele.target.value);
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            handleChange(ele.target.value);
        }, 500);
    }

    function handleChange(text) {
        setError(false);
        setLoading(true);

        if (inputValue) {
            // 입력값이 바뀌면 setType 호출
            setType(text).then(() => {
                setLoading(false);
            }).catch(e => {
                setError(true);
            });
        } else {
            setLoading(false);
        }
    }


    async function setType(text) {
        const jsonArray = await getJson(text)

        if (typeof jsonArray === "undefined") {
            // 결과가 undefined 인 경우
            setCatCard([]);
        } else {
            // 정상적인 결과
            setCatCard(addImges(jsonArray));
        }
    }

    async function getJson(input) {
        const url = `https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=${input}`;

        // api 결과(json 형식)
        const result = await fetch(url);
        const resJson = await result.json();

        return resJson.data;
    }

    function addImges(jsonArray) {
        const imgs = jsonArray.map(arr => arr.url);

        return jsonArray
            .filter(arr => !imgs.includes(arr.url))
            .map((img) => ({
                url: img.url,
                engName: img.name.split("/")[0],
                koName: img.name.split("/")[1]
            }));
    }

    function renderCard() {
        if (loading) {
            return <LoadingSpinner/>;
        }

        if (error) {
            return <div>다시 시도 해주세요.</div>
        }

        if (catCard.length === 0) {
            return <div>검색 결과가 없습니다.</div>
        } else {
            return catCard.map((obj, index) => <CatCard url={obj.url}
                                                        engName={obj.engName}
                                                        koName={obj.koName}
                                                        lazy={false} index={index}/>);
        }
    }

    return (
        <div className={"App"}>
            <header className={"App-header"}>
                <main>
                    <div>
                        <input className={"input"} type="text" id="inputType"
                               placeholder="고양이 종류를 입력해주세요."
                               onChange={debounce}
                               value={inputValue}/>
                    </div>
                    <div className={"cat-div"} id="catDiv">
                        {renderCard()}
                    </div>
                </main>
            </header>
        </div>
    );
}

export default App;