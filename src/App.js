import React , { Component} from 'react';
import { Container, Row, Col, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// box displayed with unique color (element)
const Box = ({color, offset}) => {
  // set style with color as props
  const style = {
    height: "100px",
    backgroundColor: color
  }
  return (
  <Col xs={{size:2, offset: offset}} style={style}/>
  );
}

// main class
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {boxes: [], tmpBoxes: [], filter: 0, categories: []};
  }
  // set 40 color random for state boxes, tmpboxes(the one displayed during render), category as selection for generated rgb
  componentDidMount() {
    var i = 0;
    var initboxes = [];
    // init default category
    var initCategory = [{index: 99, name: "Select Category"}];
    // random 40 times
    for(i=0; i<40; i++) {
      var rgb = 'rgb('+(Math.random()*256|0)+ "," + (Math.random()*256|0) + "," + (Math.random()*256|0) + ")";
      // loop for unique color
      while(initboxes.includes(rgb)) {
        rgb = 'rgb('+(Math.random()*256|0)+ "," + (Math.random()*256|0) + "," + (Math.random()*256|0) + ")";
      }
      // get color category name
      var copyRgb = rgb.replace(/[^0-9,]/g,'').replace().split(",");
      var nameColor = this.colorName(this.hsl(copyRgb))+" "+this.inten(copyRgb);
      if(initCategory.map(function(x) {return x.name; }).indexOf(nameColor) === -1) {
        initCategory.push({index: i, name: nameColor});
      }
      // push to boxes
      initboxes.push(
      {index: i,
        color: rgb,
        category: nameColor
      });
    }
    this.setState({boxes: initboxes, tmpBoxes: initboxes, categories: initCategory});
  }
  // filter boxes based on category change event
  filterChange = (event) => {
    var val = event.target.value;
    var filterBoxes = [];
    console.log(val);
    if(val !== "Select Category") {
      filterBoxes =  this.state.boxes.filter(function(box) {
        return box.category === val;
      });
    } else {
      filterBoxes = this.state.boxes;
    }
    this.setState({filter: event.target.value, tmpBoxes: filterBoxes});
  }
  // get rgb array
  hsl(rgbArr) {
    var r1 = Number(rgbArr[0]) / 255, g1 = Number(rgbArr[1]) / 255, b1 = Number(rgbArr[2]) / 255;
    var maxColor = Math.max(r1,g1,b1), minColor = Math.min(r1,g1,b1);
    var L = (maxColor + minColor) / 2 , S = 0, H = 0;
    if(maxColor !== minColor){
      if(L < 0.5){
        S = (maxColor - minColor) / (maxColor + minColor);
      }else{
        S = (maxColor - minColor) / (2.0 - maxColor - minColor);
      }
      if(r1 === maxColor){
        H = (g1-b1) / (maxColor - minColor);
      }else if(g1 === maxColor){
        H = 2.0 + (b1 - r1) / (maxColor - minColor);
      }else{
        H = 4.0 + (r1 - g1) / (maxColor - minColor);
      }
    }
    L = L * 100;
    S = S * 100;
    H = H * 60;
    if(H<0){
      H += 360;
    }
    return {h:H, s:S, l:L};
  }
  // get color first name from rgb array
  colorName(hsl) {
      var l = Math.floor(hsl.l), s = Math.floor(hsl.s), h = Math.floor(hsl.h);
      if (s <= 10 && l >= 90) {
          return ("White")
      } else if ((s <= 10 && l <= 70) || s === 0) {
          return ("Gray")
      } else if (l <= 15) {
          return ("Black")
      } else if ((h >= 0 && h <= 15) || h >= 346) {
          return ("Red");
      } else if (h >= 16 && h <= 35) {
          if (s < 90) {
              return ("Brown");
          } else {
              return ("Orange");
          }
      } else if (h >= 36 && h <= 54) {
          if (s < 90) {
              return ("Brown");
          } else {
              return ("Yellow");
          }
      } else if (h >= 55 && h <= 165) {
          return ("Green");
      } else if (h >= 166 && h <= 260) {
          return ("Blue")
      } else if (h >= 261 && h <= 290) {
          return ("Purple")
      } else if (h >= 291 && h <= 345) {
          return ("Pink")
      }
  }
  // get color second name
  inten(rgb){
    var hex = "";
    hex += Number(rgb[0]).toString(16); hex += Number(rgb[1]).toString(16);
    hex += Number(rgb[2]).toString(16);
    var txt = "";
    rgb = parseInt(hex, 16);
    var r = (rgb >> 16) & 0xff; 
    var g = (rgb >>  8) & 0xff;
    var b = (rgb >>  0) & 0xff; 
    var inten = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    if(inten >= 80 && inten <= 100){
      txt = "semi dark";
    }    else if(inten < 40){
      txt = "dark";
    }    else{
      txt = "light";
    }
   return txt;
  }
  // render boxes loop
  renderBoxes() {  
      return (this.state.tmpBoxes.map((box, index) =>
        <Box key={box.index} color={box.color} offset={((index)%5) === 0? 1 : 0}/>
    ));
  }
  // render category selection
  renderCategory() {  
    return (this.state.categories.map((category) =>
      <option key={category.index} >{category.name}</option>
    ));
  }
  render() {
    const boxes = this.renderBoxes();
    const categories = this.renderCategory();
    return(
      <Container>
        <Row style={{marginBottom: "30px"}}>
          <Label for="exampleSelect">Category</Label>
          <Input type="select" onChange={this.filterChange} value={this.state.filter}>
            {categories}
          </Input>
        </Row>
        <Row>
          {boxes}
        </Row>
      </Container>
    )
  }
}

export default App;
