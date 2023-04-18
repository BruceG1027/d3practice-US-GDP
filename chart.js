const req = new XMLHttpRequest()
req.open('GET','https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', true)
req.send()
req.onload = function() {
    let dataset = JSON.parse(req.responseText).data
    console.log(dataset)

    const w = 2000
    const h = 1000
    const padding = 100
    const convertDetailYear = 1750  // 标签变方向的位置

    // 转换数据格式函数
    function yearConvert(yearString) {
        let yearArray = yearString.split('-')
        let quarterConvert = (yearArray) => {
            if (yearArray[1] == 4) return 'Q1'
            else if (yearArray[1] == 7) return 'Q2'
            else if (yearArray[1] == 10) return 'Q3'
            else return 'Q4'
        }
        return yearArray[0] + ' ' + quarterConvert(yearArray)
    }

    function gdpConvert(gdpString) {
        return '$' + gdpString + ' Billion'
    }
    // console.log(gdpConvert('10472.3'))

    // 创建svg
    const svg = d3.select('.vis')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)
    // 画图比例尺
    const xScale = d3.scaleLinear()
                        .range([padding, w - padding])
                        .domain([0, dataset.length])

    const yScale = d3.scaleLinear()
                        .range([0, h - 2 * padding])
                        .domain([0, d3.max(dataset, (d) => d[1])])

    // 创建贴图
    let detail = d3.select('.vis')
                        .append('div')
                        .attr('class', 'detail')

    // 颜色比例尺
    const colorScale = d3.scaleLinear()
                        .range([[110,141,176],[21,25,44]])
                        .domain([d3.min(dataset, (d) => d[1]), d3.max(dataset, (d) => d[1])])

    // 绘制直方块（主体）
    svg.selectAll('rect')
        .data(dataset)
        .enter().append('rect')
        .attr('x', (d, i) => xScale(i))
        .attr('width', (w - 2 * padding) / dataset.length)
        .attr('y', (d, i) => (h - padding) - yScale(d[1]))
        .attr('height', (d, i) => yScale(d[1]))
        .attr('fill', (d) => 'rgb(' + colorScale(d[1])[0] + ',' + colorScale(d[1])[1] + ',' + colorScale(d[1])[2] + ')')
        .attr('class', 'bar')
        .on('mouseover', (d, i) =>  {
            // console.log(xScale(i) + 40);
            detail  
            .style('left', () => {
                if(xScale(i) + 40 > convertDetailYear) return xScale(i) - 190 +'px'
                else return xScale(i) + 40 +'px'
            })
            .style('opacity', 0.8)
            .html('<p>' +yearConvert(d[0]) + '</p>' +'<br>' + '<p>' +gdpConvert(d[1]) + '</p>')
        })
        .on('mouseout', () => {
            detail
            .style('opacity', 0)
        })


    // 绘制坐标轴
    const xAxisScale = d3.scaleLinear()
                        .range([padding, w - padding])
                        .domain([1947, 2015])
    const yAxisScale = d3.scaleLinear()
                        .range([h-2*padding, 0])
                        .domain([0, d3.max(dataset, (d) => d[1])])
    const xAxis = d3.axisBottom(xAxisScale).ticks(10).tickFormat(d3.format("c"))
    const yAxis = d3.axisLeft(yAxisScale).ticks(15)


    svg.append('g')
        .attr("class", "x-axis")
        .attr('transform','translate(0,' + (h - padding) + ')')
        .call(xAxis)

    // 为x轴添加说明
    svg.select(".x-axis")
        .selectAll("text")
        .attr('font-size', 16)
        .attr("y", 16)
        .style("text-anchor", "middle")
        .text((d) => 'Year ' + d); 

    svg.append('g')
        .attr("class", "y-axis")
        .attr('transform', 'translate(' + padding + ',' + padding + ')')
        .call(yAxis)

    svg.select('.y-axis')
        .selectAll('text')
        .attr('font-size', 16)
        .text((d) => '$ ' + d + 'B')
        // 这里是直接返回,加花括号则要用return

    // 添加补充文字
    svg.append('text')
      .attr('transform', 'rotate(-90), translate(' + (-padding-210) + ',' + (padding+30) + ')')
      .attr('font-size', 20)
      .attr('font-weight', 'large')
      .text('Gross Domestic Product');

    svg.append('text')
        .attr('x', 1200)
        .attr('y', 980)
        .attr('font-size', 16)
        .text('信息来源：https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')

}

