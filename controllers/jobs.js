const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdby: req.user.userId }).sort("createdAt");
  console.log(jobs);
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length, saba: "dpsjkl" });
};

const getJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdby: userId,
  });
  console.log("userId:", userId);
  console.log("jobId:", jobId);

  console.log(job);

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdby = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
    body: { company, position },
  } = req;
  if (company === " " || position === " ") {
    throw new BadRequestError("please provide company and position");
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdby: userId },
    req.body,
    { new: true, runValidators: true }
  );
  console.log(job);
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Job.findByIdAndDelete({ _id: jobId, createdby: userId });
  if (!job) {
    throw new BadRequestError(`no job found with ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};
module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
