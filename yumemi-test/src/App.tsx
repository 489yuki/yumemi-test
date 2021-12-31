import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import CheckBoxItem from './component/checkBoxItem';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

type PrefData = {
  prefCode:number
  prefName:string
}

function App(props: HighchartsReact.Props) {

  
  const [prefList,setPrefList] = useState<PrefData[]>([]);
  const [isFetched,setIsFetched] = useState(false)
  const [selectedList,setSelectedList] = useState<boolean[]>(Array(47).fill(false))
  const [chartDataList,setChartDataList] = useState<Highcharts.SeriesOptionsType[]>([])
  const apiKey = process.env.REACT_APP_API_KEY as string

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  const option:Highcharts.Options = {
    title: {
        text: '都道府県別人口推移'
    },
    
    yAxis: {
      labels: {
        format: '{value}人'
    },
      title:{
        text: "人口"
      }
  },
    xAxis: {
      title: {
        text: '年'
      },
      categories: ['1960','1965','1970','1975','1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2025', '2030', '2035','2040','2045']
    },
    // state参照
    series: chartDataList
};

 


  useEffect(() => {
    if(!isFetched) {
      fetch("https://opendata.resas-portal.go.jp/api/v1/prefectures",{
        headers: { 'X-API-KEY':apiKey  }
      }).then((res => res.json())).then(
        (result) => {
            setPrefList(result.result)
            setIsFetched(true)
        }
      )
    }
   
    
  },[])

 

  const handleChange = (event: { target: { name: any; checked: any; }; }) => {
    const index =  Number(event.target.name) -1
    var list = [...selectedList]
    list[index] = !list[index]
    setSelectedList(list)

    if(list[Number(event.target.name) - 1] === true) {
      // チェックした時の処理
      fetch(`https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?prefCode=${event.target.name}`, {
        headers: { 'X-API-KEY':apiKey  }
      }).then(res => res.json()).then((result) => {
        let dataList = [...chartDataList]
        var data:number[] = []
        for(var i = 0; i < result.result.data[0].data.length; i ++) {
          data.push(result.result.data[0].data[i].value )
        }
        dataList.push({data:data,name:prefList[Number(event.target.name)-1].prefName,type:"line"})
        setChartDataList(dataList)
      })
    } else {
      // チェック外した時の処理
      for(var i = 0; i < chartDataList.length;i++) {
        let dataList = [...chartDataList]
        if(dataList[i].name === prefList[Number(event.target.name-1)].prefName) {
          dataList.splice(i,1)
          setChartDataList(dataList)
          break
        }
      }
    }
  };

  return (
<>
<header style={{color:"white",padding: 15,background: "#39C7DC"}}>都道府県別人口グラフ</header>
<p>都道府県</p>
    <div>
        <div style={{display:'flex',flexWrap:"wrap",}}>
          {prefList.map((a:PrefData) => (
            <CheckBoxItem key={a.prefCode} prefName={a.prefName} checked={selectedList[a.prefCode - 1]} handleChange={handleChange} prefCode={a.prefCode}/>
          ))}
          </div>
    </div>
    {
      chartDataList.length !== 0?
    <HighchartsReact
      highcharts={Highcharts}
      options={option}
      ref={chartComponentRef}
      {...props}
    /> : 
      <p>都道府県を選択してください</p>
}
    </>
  );
}

export default App;


