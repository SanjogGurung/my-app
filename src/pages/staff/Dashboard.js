import { Link, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import '../../styles/staff/Dashboard.css'
import { useState } from "react";

export default function Dashboard() {
    const sidebarItems = useState();
    return(
        <div className="staff-dashboard">
            <div className = "logo">
                SuSankhya
            </div>
            <div className="second-row">
                <Sidebar />
            </div>
            


        </div>
    )
}