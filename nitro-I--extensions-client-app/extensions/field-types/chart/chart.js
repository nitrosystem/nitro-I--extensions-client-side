function ChartController(field, $scope, moduleController, $element) {
  this.init = function () {
    createChart();
  }

  function createChart() {

    //Lable Block
    var labels = field.Settings.LableType == "CustomLable" ?
      (field.Settings.CustomLables.map((item) => item.LableName)) :
      (field.DataSource.Items.map((item) => item[field.Settings.BindLable.Content]));
    //Setup Block
    var datasets = field.Settings.Columns.map((col, index) => (
      {
        label: col.Title,
        data: field.DataSource.Items.map((item) => item[col.Content]),
        borderWidth: field.Settings.BorderWidth == 0 ? 1.5 : field.Settings.BorderWidth,
        cubicInterpolationMode: 'monotone',
        tension: field.Settings.Tension == 0 ? 0.3 : field.Settings.Tension,
        pointStyle: 'circle',
        radius: field.Settings.Radius == 0 ? 1 : field.Settings.Radius,
        borderColor: col.BorderColor ? col.BorderColor : Chart.defaults.borderColor,
        backgroundColor: col.BackgroundColor ? col.BackgroundColor : Chart.defaults.backgroundColor,
      })
    );

    const data = {
      labels,
      datasets
    };
    //Config Block
    const config = {
      type: field.Settings.ChartType ? field.Settings.ChartType  : 'line',
      data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            //fontFamily: "'tahoma'"
            // min:0,
            //max:50
          },

        },
        plugins: {
          legend: {
            rtl: field.Settings.Direction ? field.Settings.Direction == "rtl" : false,
            textDirection: field.Settings.Direction ? field.Settings.Direction : 'ltr',
            labels: {
              font: {
                size: field.Settings.FontSize == 0 ? 14 : field.Settings.FontSize,
                family: field.Settings.FontFamily == "" ? "'Tahoma'" : field.Settings.FontFamily
              }
            }
          },
          layout: {
            labels: {
              font: {
                size: field.Settings.FontSize == 0 ? 14 : field.Settings.FontSize,
                family: field.Settings.FontFamily == "" ? "'Tahoma'" : field.Settings.FontFamily
              }
            }
          }
        }
      }
    }
    //Render Block
    debugger
    Chart.defaults.font.family = field.Settings.FontFamily == "" ? "'Tahoma'" : field.Settings.FontFamily;
    const myChart = new Chart(document.getElementById('chart-' + field.FieldName), config);
  }
}