import { useEffect, useState } from "react";
import {findProfessores} from "../services/professorService";  

function Home() {
  const [professores, setProfessores] = useState([]);

  useEffect(() => {
    findProfessores()
      .then(res => setProfessores(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Lista de Professores</h1>
      <ul>
        {professores.map(p => (
          <li key={p.id}>{p.nome}</li>
        ))}
      </ul>
    </div>
  );

}

export default Home;
