
class NumericValueToken
{
  value?: number;
  absolute: boolean = true;
  constructor( 
    value?:number, 
    absolute?:boolean
  ) {
    this.value = ( value !== undefined ) ? value : this.value;
    this.absolute = ( absolute !== undefined ) ? absolute : this.absolute;
  }

}

export { NumericValueToken };
