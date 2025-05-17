from bottle import route, view, request
from datetime import datetime

# ќбЄртка, добавл€юща€ текущий путь и год во все шаблоны
def with_common_data(template_name):
    def decorator(func):
        @view(template_name)
        def wrapped(*args, **kwargs):
            data = func(*args, **kwargs)
            data['year'] = datetime.now().year
            data['current_url'] = request.path
            return data
        return wrapped
    return decorator

@route('/')
@route('/home')
@with_common_data('index')
def home():
    return {
        'title': 'Home'
    }

@route('/about')
@with_common_data('about')
def authors():
    return {
        'title': 'Authors',
        'message': 'Your application description page.'
    }

@route('/EducationalTrajectoryTheory')
@with_common_data('EducationalTrajectoryTheory')
def EducationalTrajectoryTheory():
    return {
        'title': 'Educational trajectory',
        'message': 'Your application description page.'
    }

@route('/EducationalTrajectoryTheoryDecision')
@with_common_data('EducationalTrajectoryTheoryDecision')
def EducationalTrajectoryTheoryDecision():
    return {
        'title': 'Educational trajectory',
        'message': 'Your application description page.'
    }

@route('/CreatingRecommendationSystemTheory')
@with_common_data('CreatingRecommendationSystemTheory')
def CreatingRecommendationSystemTheory():
    return {
        'title': 'Recommendation systems',
        'message': 'Your application description page.'
    }

@route('/CreatingRecommendationSystemDecision')
@with_common_data('CreatingRecommendationSystemDecision')
def CreatingRecommendationSystemDecision():
    return {
        'title': 'Recommendation systems',
        'message': 'Your application description page.'
    }

@route('/DiscoveringCommunityUsingGirvanNewmanTheory')
@with_common_data('DiscoveringCommunityUsingGirvanNewmanTheory')
def DiscoveringCommunityUsingGirvanNewmanTheory():
    return {
        'title': 'Community discovery',
        'message': 'Your application description page.'
    }

@route('/DiscoveringCommunityUsingGirvanNewmanDecision')
@with_common_data('DiscoveringCommunityUsingGirvanNewmanDecision')
def DiscoveringCommunityUsingGirvanNewmanDecision():
    return {
        'title': 'Community discovery',
        'message': 'Your application description page.'
    }
