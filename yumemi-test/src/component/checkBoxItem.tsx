const CheckBoxItem:React.FC<{checked:boolean,prefCode:number,prefName:string,handleChange:any}>= (props) => {
    return (
        <>
        <div>
        <input type="checkbox" checked={props.checked} onChange={props.handleChange} name={`${props.prefCode}`}/>
        <span>{props.prefName}</span>
        </div>
        </>
    )
}

export default CheckBoxItem