import './App.css';
import CatCard from "./component/CatCard";
import LoadingSpinner from "./component/LoadingSpinner";
import {useEffect, useState} from "react";

function App() {
    let timer;
    let [inputValue, setInputValue] = useState("");
    let [mainString, setMainString] = useState("message");

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
            console.log("변경된 값 : " + inputValue);
        }, 500);
    }

    async function setType() {
        // main 결과에 해당하는 값 return
        console.log("입력 문자 : " + inputValue);
        let checking = false;
        let mainContent = '';
        try {
            if (inputValue === "") {
                // 아무것도 들어 오지 않은 경우
                mainContent = "입력해 주세요";
            } else {
                setMainString(<LoadingSpinner/>);
                const jsonArray = await getJson(inputValue)
                if (jsonArray.length === 0) {
                    // 결과가 0개인 경우
                    mainContent = "결과가 없습니다."
                    console.log(mainContent);
                } else {
                    // 정상적인 결과
                    mainContent = addImges(jsonArray);
                    checking = true;
                }
            }
        } catch (e) {
            // 에러나는 경우
            mainContent = 'Error'+e;
        }

        if(checking) console.log("Get Array"); // 정상적 결과
        else console.log(mainContent);

        // setMainString(mainContent);

        // return mainContent;
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
        return jsonArray.map((array, index) => {
                const imgUrl = array.url;
                const imgName = array.name;
                const nameArray = imgName.split(' / ');

                // 이전에 존재하는 경우 넘어가기
                if (imgUrlArray.includes(imgUrl)) return <></>;
                imgUrlArray.push(imgUrl);

                // console.log(index + "번째 : " + imgUrl);
                return <CatCard url={imgUrl} nameArray={nameArray}/>;
            }
        );
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