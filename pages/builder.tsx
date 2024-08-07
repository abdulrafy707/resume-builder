import React, { useEffect, useState, useCallback } from "react";
import BuilderLayout from "../components/modules/builder/BuilderLayout";
import { UserData } from "../store/SignIn_SignOut";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig/FirebaseConfig";

// stores
import { AwardDetailStore } from "../store/awards_store";
import BasicDetailStore from "../store/basic_store";
import { EducationDetailStore } from "../store/education_store";
import { ExperienceDetailStore } from "../store/experience_store";
import { ProjectsDetailStore } from "../store/projects_store";
import { SkillDetailStore } from "../store/skill_store";

import { BuilderPageLoading } from "../components/Loading_Button";

const builder = () => {
  const { setLanguages, setFrameworks, setDatabases, setTools } =
    SkillDetailStore((state) => ({
      setLanguages: state.setLanguages,
      setFrameworks: state.setFrameworks,
      setDatabases: state.setDatabases,
      setTools: state.setTools,
    }));

  const { setProjects } = ProjectsDetailStore((state) => ({
    setProjects: state.setProjects,
  }));

  const { setExperience } = ExperienceDetailStore((state) => ({
    setExperience: state.setExperience,
  }));

  const { setEducation } = EducationDetailStore((state) => ({
    setEducation: state.setEducation,
  }));

  const { changeValue } = BasicDetailStore((state) => ({
    changeValue: state.changeValue,
  }));

  const { setAwards } = AwardDetailStore((state) => ({
    setAwards: state.setAwards,
  }));

  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    let value = localStorage.getItem("userInfo");
    if (typeof value === "string") {
      let userInfo: UserData = JSON.parse(value);
      const docRef = doc(db, "resumedata", userInfo.userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAwards(data?.awards);
        setEducation(data?.education);
        setExperience(data?.work);
        setProjects(data?.projects);
        changeValue(data?.basics);
        setLanguages(data?.skills.languages);
        setDatabases(data?.skills.databases);
        setFrameworks(data?.skills.frameworks);
        setTools(data?.skills.tools);
      }
    }
    setLoading(false);
  }, [setAwards, setEducation, setExperience, setProjects, changeValue, setLanguages, setDatabases, setFrameworks, setTools]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      {loading ? (
        <BuilderPageLoading />
      ) : (
        <BuilderLayout />
      )}
    </div>
  );
};

export default builder;
