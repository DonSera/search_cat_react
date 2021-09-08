import styles from './CatCard.module.css'

function CatCard({url, engName, koName}) {
    return(
        <div className={styles["cat-card"]}>
            <img className={styles["cat-card-img"]} src={url} alt="고양이"/>
            <p>{engName}</p>
            <p>{koName}</p>
        </div>
    );
}

export default CatCard;