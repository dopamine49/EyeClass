package com.eyecare.service;

import com.eyecare.dto.feedback.FeedbackRequest;
import com.eyecare.model.Feedback;
import com.eyecare.repository.FeedbackRepository;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public Feedback createFeedback(FeedbackRequest request) {
        Feedback feedback = new Feedback();
        feedback.setName(request.name());
        feedback.setEmail(request.email());
        feedback.setMessage(request.message());
        return feedbackRepository.save(feedback);
    }
}
