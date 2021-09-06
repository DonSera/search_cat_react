import './App.css';
import CatCard from "./component/CatCard";
import {useEffect, useState} from "react";

function App() {
    let timer;
    let [inputValue, setInputValue] = useState("");
    let [mainString, setMainString] = useState("message");

    useEffect(() => {
        // 입력값이 바뀌면 setType 호출 promise로 넘어 오기 때문에 이렇게 처리
        setType().then(message => {
            setMainString(message);
        });
    }, [inputValue])

    function debounce(ele) {
        // 단어 단위로 검색정갱신
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            setInputValue(ele.target.value);
            console.log("변경된 값 : " + inputValue);
        }, 500);
    }

    async function setType() {
        // 결과에 해당하는 값을 main에 갈아 끼우기
        let mainContent = 'error';
        try {
            if (inputValue === "") {
                // 아무것도 들어 오지 않은 경우
                mainContent = "Get no word";
                console.log(mainContent);
            } else {
                console.log("입력 문자 : " + inputValue);
                const jsonArray = await getJson(inputValue)
                if (jsonArray.length === 0) {
                    mainContent = "Non result";
                    console.log(mainContent);
                } else {
                    console.log("Get array")
                    mainContent = addImges(jsonArray);
                }
            }
        } catch (e) {
            console.log("Error" + e);
            mainContent = 'Error';
        }
        return mainContent;
    }

    async function getJson(input) {
        console.log("fetch start");
        const url = "https://oivhcpn8r9.execute-api.ap-northeast-2.amazonaws.com/dev/api/cats/search?q=" + input;
        const result = await fetch(url)
            .then(res => res.json())
            .then((resJson) => {
                return resJson.data;
            })

        console.log("fetch end");
        return result;
    }

    function addImges(jsonArray) {
        const imgUrlArray = [];
        const catCardDiv = jsonArray.map((array, index) => {
                const imgUrl = array.url;
                const imgName = array.name;
                const nameArray = imgName.split(' / ');

                if (imgUrlArray.includes(imgUrl)) return <></>;
                imgUrlArray.push(imgUrl);

                console.log(index + "번째 : " + imgUrl);
                return <CatCard url={imgUrl} nameArray={nameArray}/>;
            }
        )
        return catCardDiv;
    }


    return (
        <div className="App">
            <header className="App-header">
                <main>
                    <div>
                        <input className="input" type="text" id="inputType"
                               placeholder="고양이 종류를 입력해주세요."
                            // value={inputValue}
                               onInput={debounce}/>
                    </div>
                    <div className="cat-div" id="catDiv">
                        {mainString}
                    </div>
                </main>
            </header>
        </div>
    );
}


export default App;