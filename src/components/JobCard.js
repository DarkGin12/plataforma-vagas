function JobCard({ job }) {

  return (

    <div className="job-card">

      <h3>{job.title}</h3>

      <p>{job.company}</p>

      <div className="stacks">

        {job.stacks.map((stack, index) => (
          <span key={index}>{stack}</span>
        ))}

      </div>

      <p>{job.description}</p>

      <p>Prazo: {job.deadline}</p>

      <button className="btn-primary">
        Ver detalhes
      </button>

    </div>

  );

}

export default JobCard;