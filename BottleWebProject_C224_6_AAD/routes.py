"""
Routes and views for the bottle application.
"""

from bottle import route, view
from datetime import datetime

@route('/')
@route('/home')
@view('index')
def home():
    """Renders the home page."""
    return dict(
        year=datetime.now().year
    )

@route('/authors')
@view('authors')
def authors():
    """Renders the about page."""
    return dict(
        title='Authors',
        message='Your application description page.',
        year=datetime.now().year
    )

@route('/demidova')
@view('demidova')
def demidova():
    """Renders the about page."""
    return dict(
        title='Recommendation systems',
        message='Your application description page.',
        year=datetime.now().year
    )

@route('/EducationalTrajectoryTheory')
@view('EducationalTrajectoryTheory')
def EducationalTrajectoryTheory():
    """Renders the recommendation systems page."""
    return dict(
        title='Recommendation systems',
        message='Your application description page.',
        year=datetime.now().year
    )