function CatCard({url, nameArray}) {
    return(
        <div className="cat-card">
            <img src={url} alt="고양이" width="200" height="200"/>
            <p>{nameArray[0]}</p>
            <p>{nameArray[1]}</p>
        </div>
    );
}

export default CatCard;