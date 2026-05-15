import { careerRecommendationsService } from "./career-recommendations.service.js";

export async function getFilters(_req, res, next) {
  try {
    const result = await careerRecommendationsService.getFilters();

    res.status(200).json({
      message: "Career recommendation filters fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function generateRecommendations(req, res, next) {
  try {
    const result = await careerRecommendationsService.generate(req.user.id, req.body);

    res.status(201).json({
      message: "Career recommendations generated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLatestRecommendations(req, res, next) {
  try {
    const result = await careerRecommendationsService.getLatest(req.user.id, req.query);

    res.status(200).json({
      message: "Career recommendations fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function saveCareer(req, res, next) {
  try {
    const result = await careerRecommendationsService.saveCareer(req.user.id, req.body.careerId);

    res.status(200).json({
      message: "Career recommendation saved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteSavedCareer(req, res, next) {
  try {
    const result = await careerRecommendationsService.deleteSavedCareer(
      req.user.id,
      req.params.careerId
    );

    res.status(200).json({
      message: "Saved career recommendation removed successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
