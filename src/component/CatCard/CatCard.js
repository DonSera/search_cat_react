import styles from './CatCard.module.css'

function CatCard({url, nameArray}) {
    return(
        <div className={styles["cat-card"]}>
            <img className={styles["cat-card-img"]} src={url} alt="고양이"/>
            <p>{nameArray[0]}</p>
            <p>{nameArray[1]}</p>
        </div>
    );
}

export default CatCard;