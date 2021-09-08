import styles from './CatCard.module.css'

function CatCard({url, engName, koName, lazy, index}) {
    return (
        <div className={styles["cat-card"]}>
            {lazy ?
                <img className={styles["cat-card-lazy"]} data-src={url} alt="고양이"/>
                : <img className={styles["cat-card-img"]} src={url} alt="고양이"/>
            }
            <p>{index+1 + ") " + engName}</p>
            <p>{koName}</p>
        </div>
    );
}

export default CatCard;