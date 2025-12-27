import styles from './Student.module.css'

interface StudentProps {
    name?: string;
}

function Student(props: StudentProps){

    const {name = "Guest"} = props;

    return(
        <div className={styles.card}>
            <h1>{name}</h1>
        </div>
    );
}

export default Student;