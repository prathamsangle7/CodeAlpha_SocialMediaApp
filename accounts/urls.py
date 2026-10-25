from django.urls import path
from .views import RegisterView, LoginView, MyProfileView, ProfileDetailView, FollowToggleView, UserSearchView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/me/', MyProfileView.as_view(), name='my-profile'),
    path('search/', UserSearchView.as_view(), name='user-search'),
    path('profile/<str:username>/', ProfileDetailView.as_view(), name='profile-detail'),
    path('profile/<str:username>/follow/', FollowToggleView.as_view(), name='follow-toggle'),
]
