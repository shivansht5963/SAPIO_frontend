import PageHeader from '../components/layout/PageHeader';
import Card from '../components/ui/Card';
import './Reports.css';

export default function Reports() {
  return (
    <div className="reports">
      <PageHeader
        title="Reports"
        subtitle="Operational analytics and performance metrics."
      />

      <div className="reports__grid">
        {/* Pending Tasks Overview */}
        <Card title="Pending Tasks Overview">
          <table className="reports__table">
            <thead>
              <tr>
                <th>Region</th>
                <th>Team</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>North</td><td>Alpha Squad</td><td className="reports__count reports__count--high">14</td></tr>
              <tr><td>South</td><td>Bravo Team</td><td className="reports__count">8</td></tr>
              <tr><td>West</td><td>Charlie Unit</td><td className="reports__count reports__count--high">12</td></tr>
              <tr><td>Northwest</td><td>Delta Force</td><td className="reports__count">5</td></tr>
              <tr><td>Southeast</td><td>Echo Group</td><td className="reports__count">3</td></tr>
            </tbody>
          </table>
        </Card>

        {/* Agent Performance */}
        <Card title="Agent Performance">
          <table className="reports__table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Avg Duration</th>
                <th>Total Visits</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>John Doe</td><td className="reports__fast">2h 15m</td><td>28</td></tr>
              <tr><td>Sarah Jenkins</td><td className="reports__fast">2h 45m</td><td>22</td></tr>
              <tr><td>David Miller</td><td>3h 30m</td><td>18</td></tr>
              <tr><td>Elena Rodriguez</td><td className="reports__slow">4h 10m</td><td>15</td></tr>
              <tr><td>Marcus Vance</td><td>3h 05m</td><td>20</td></tr>
            </tbody>
          </table>
        </Card>

        {/* Visit Activity */}
        <Card title="Visit Activity (Last 7 Days)">
          <table className="reports__table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Visits Completed</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>May 20</td><td>12</td><td className="reports__trend-up">↑</td></tr>
              <tr><td>May 19</td><td>8</td><td className="reports__trend-down">↓</td></tr>
              <tr><td>May 18</td><td>15</td><td className="reports__trend-up">↑</td></tr>
              <tr><td>May 17</td><td>10</td><td>—</td></tr>
              <tr><td>May 16</td><td>7</td><td className="reports__trend-down">↓</td></tr>
              <tr><td>May 15</td><td>11</td><td className="reports__trend-up">↑</td></tr>
              <tr><td>May 14</td><td>9</td><td>—</td></tr>
            </tbody>
          </table>
        </Card>

        {/* Task Distribution */}
        <Card title="Task Distribution by Region">
          <div className="reports__table-wrapper">
            <table className="reports__table reports__table--distribution">
              <thead>
                <tr>
                  <th>Region</th>
                  <th>Pending</th>
                  <th>Assigned</th>
                  <th>In Progress</th>
                  <th>Completed</th>
                  <th>Cancelled</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>North</td>
                  <td className="reports__cell--pending">14</td>
                  <td className="reports__cell--assigned">8</td>
                  <td className="reports__cell--progress">12</td>
                  <td className="reports__cell--completed">45</td>
                  <td className="reports__cell--cancelled">3</td>
                </tr>
                <tr>
                  <td>South</td>
                  <td className="reports__cell--pending">8</td>
                  <td className="reports__cell--assigned">5</td>
                  <td className="reports__cell--progress">6</td>
                  <td className="reports__cell--completed">32</td>
                  <td className="reports__cell--cancelled">1</td>
                </tr>
                <tr>
                  <td>West</td>
                  <td className="reports__cell--pending">12</td>
                  <td className="reports__cell--assigned">10</td>
                  <td className="reports__cell--progress">4</td>
                  <td className="reports__cell--completed">28</td>
                  <td className="reports__cell--cancelled">2</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
