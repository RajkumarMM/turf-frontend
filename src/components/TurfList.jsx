const TurfList = ({ turfs }) => {
    return (
        <div className="mt-5">
            <h2>Your Turfs</h2>
            {turfs.length === 0 ? (
                <p>No turfs registered yet.</p>
            ) : (
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>#</th>
                            <th>Turf Name</th>
                            <th>Location</th>
                            <th>Price (₹)</th>
                            <th>Timings</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turfs.map((turf, index) => (
                            <tr key={turf._id}>
                                <td>{index + 1}</td>
                                <td>{turf.name}</td>
                                <td>{turf.location}</td>
                                <td>{turf.price}</td>
                                <td>
    {turf.timings && turf.timings.length > 0 ? (
        turf.timings.map((time, i) => (
            <span
                key={i}
                className="badge badge-info mx-1"
                style={{ backgroundColor: "#17a2b8", color: "#fff" }}
            >
                {time}
            </span>
        ))
    ) : (
        <span className="text-muted">No timings available</span>
    )}
</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default TurfList;
