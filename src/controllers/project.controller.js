import prisma from '../config/db.js';

export const createProject = async (req, res) => {
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const project = await prisma.project.create({
    data: {
      title,
      description,
      imageUrl,
    },
  });

  res.status(201).json(project);
};

export const getAllProjects = async (req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(projects);
};

export const getProjectById = async (req, res) => {
  const { id } = req.params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
};

export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const project = await prisma.project.update({
    where: { id },
    data: {
      title,
      description,
      ...(imageUrl && { imageUrl }),
    },
  });

  res.json(project);
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;
  await prisma.project.delete({ where: { id } });
  res.json({ message: 'Project deleted' });
};
