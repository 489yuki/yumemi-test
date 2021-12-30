import { Checkbox, FormControlLabel, Grid } from "@material-ui/core"

const CheckBoxItem:React.FC<{checked:boolean,prefCode:number,prefName:string,handleChange:any}>= (props) => {
    return (
        <Grid item>
        <FormControlLabel
            control={
              <Checkbox checked={props.checked} onChange={props.handleChange} name={`${props.prefCode}`} />
            }
            label={props.prefName}
          />
          </Grid>
    )
}

export default CheckBoxItem