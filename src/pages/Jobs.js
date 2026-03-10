import Header from "../components/Header";
import JobCard from "../components/JobCard";
import jobsData from "../data/jobs";
import { useState } from "react";

function Jobs() {

  const [search, setSearch] = useState("");
  const [stack, setStack] = useState("");

  const filteredJobs = jobsData.filter((job) => {

    return (
      job.title.toLowerCase().includes(search.toLowerCase()) &&
      (stack === "" || job.stacks.includes(stack))
    );

  });

  return (

    <>
      <Header />

      <div className="jobs-page">

        <h2>Projetos Disponíveis</h2>

        <div className="filters">

          <input
            type="text"
            placeholder="Buscar vaga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={stack}
            onChange={(e) => setStack(e.target.value)}
          >

            <option value="">Todas tecnologias</option>
            <option value="React">React</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Java">Java</option>
            <option value="Spring Boot">Spring Boot</option>

          </select>

        </div>

        <div className="jobs-grid">

          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}

        </div>

      </div>

    </>
  );

}

export default Jobs;